import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import ResultRenderer from "./QueryOutput/ResultRenderer";

const PAGE_SIZE = 20;

// ─── API helper ───────────────────────────────────────────────
async function fetchQueryResult({ token, query_id, query, page }) {
  const res = await fetch(`${API_BASE_URL}/api/queries/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query_id, query, page, page_size: PAGE_SIZE }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed (${res.status})`);
  }

  return res.json(); // { query_type, result }
}

// ─── Component ────────────────────────────────────────────────
const QueryOutputPanel = ({ executions }) => {
  const [results, setResults]       = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const bottomRef                   = useRef(null);
  const { currentUser }             = useAuth();

  // Run the latest execution whenever the executions list grows
  useEffect(() => {
    if (executions.length === 0) return;
    const last = executions[executions.length - 1];
    runQuery(last, 1);
  }, [executions]);

  // Auto-scroll to bottom after each new result
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [results]);

  // Execute a query and append its result to the list
  const runQuery = async (execution, page) => {
    setIsExecuting(true);
    try {
      const token    = await currentUser.getIdToken();
      const envelope = await fetchQueryResult({
        token,
        query_id: execution.query_id,
        query:    execution.query,
        page,
      });

      setResults((prev) => [
        ...prev,
        {
          execution,              // original { query_id, query, explanation }
          queryType: envelope.query_type,
          result:    envelope.result,
        },
      ]);
    } catch (err) {
      // Surface execution errors as inline error entries
      setResults((prev) => [
        ...prev,
        {
          execution,
          queryType: "ERROR",
          result: { message: err.message },
        },
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  // Paginate an existing DQL result in-place
  const updatePage = async (index, nextPage) => {
    const { execution } = results[index];
    try {
      const token    = await currentUser.getIdToken();
      const envelope = await fetchQueryResult({
        token,
        query_id: execution.query_id,
        query:    execution.query,
        page:     nextPage,
      });

      setResults((prev) =>
        prev.map((r, i) =>
          i === index
            ? { ...r, queryType: envelope.query_type, result: envelope.result }
            : r
        )
      );
    } catch (err) {
      console.error("Pagination failed:", err.message);
    }
  };

  // ─── Render ─────────────────────────────────────────────────
  return (
    <div className="relative h-full min-h-0 w-full rounded-md bg-black border border-[#333] p-0 font-mono text-xs overflow-auto custom-scrollbar">

      {/* Header bar */}
      <div className="
        h-9 sticky top-0 z-10
        bg-[#333333] border-b border-[green]
        px-3 py-2
        flex items-center justify-between
        text-[0.75rem] uppercase tracking-wider
        text-green-300 font-bold
      ">
        <span>Output</span>
        {isExecuting && (
          <div className="flex items-center gap-2 text-green-300">
            <span className="text-[0.7rem] lowercase tracking-wider">Executing</span>
            <span className="h-3 w-3 border-2 border-green-300 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Results list */}
      <div className="p-4 space-y-8">
        {results.length === 0 && !isExecuting && (
          <p className="text-gray-600 italic">No queries executed yet.</p>
        )}

        {results.map((res, idx) => (
          <div key={idx}>
            {/* Query line */}
            <div className="text-green-400 mb-1 break-all">
              $ {res.execution.query}
            </div>

            {/* Explanation (if any) */}
            {res.execution.explanation && (
              <div className="text-gray-400 mb-1">
                {res.execution.explanation}
              </div>
            )}

            {/* Type badge for non-error, non-DQL results */}
            {res.queryType !== "DQL" && res.queryType !== "ERROR" && (
              <div className="text-gray-600 text-[0.65rem] mb-1 uppercase tracking-widest">
                {res.queryType}
              </div>
            )}

            {/* Error case */}
            {res.queryType === "ERROR" ? (
              <p className="text-red-400 mt-1">✗ {res.result.message}</p>
            ) : (
              /* Delegate to the appropriate result renderer */
              <ResultRenderer
                queryType={res.queryType}
                result={res.result}
                onPageChange={(nextPage) => updatePage(idx, nextPage)}
              />
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default QueryOutputPanel;