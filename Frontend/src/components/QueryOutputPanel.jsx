import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

const PAGE_SIZE = 20;

const QueryOutputPanel = ({ executions }) => {
  const [results, setResults] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const bottomRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (executions.length === 0) return;
    const last = executions[executions.length - 1];
    executeQuery(last.query_id,last.query, last.explanation, 1);
  }, [executions]);
  useEffect(() => {
    if (!bottomRef.current) return;
    
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [results]);

  const executeQuery = async (query_id,query, explanation, page) => {
    setIsExecuting(true); 
    
    const token = await currentUser.getIdToken();

    const res = await fetch(`${API_BASE_URL}/api/queries/execute`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query_id:query_id,
        query,
        page,
        page_size: PAGE_SIZE,
      }),
    });

    const data = await res.json();

    setResults((prev) => [
      ...prev,
      {
        query_id:query_id,
        query,
        explanation,
        pageData: data,
      },
    ]);
    
    setIsExecuting(false);
    
  };

  const updatePage = async (index, nextPage) => {
    const item = results[index];
    const token = await currentUser.getIdToken();
    const res = await fetch(`${API_BASE_URL}/api/queries/execute`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
      body: JSON.stringify({
        query_id:item.query_id,
        query: item.query,
        page: nextPage,
        page_size: PAGE_SIZE,
      }),
    });

    const data = await res.json();

    setResults((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, pageData: data }
          : r
      )
    );
  };

  return (
    <div className="relative h-full min-h-0 w-full rounded-md bg-black border border-[#333] p-0 font-mono text-xs overflow-auto custom-scrollbar">
      
      {/* Output Heading */}
      <div className="
        h-9
        sticky top-0 z-10
        bg-[#333333]
        border-b border-[green]
        px-3 py-2
        flex items-center justify-between
        text-[0.75rem] uppercase tracking-wider
        text-green-300
        font-bold
      "> 
        <span>Output</span>
        {isExecuting && (
          <div className="flex items-center gap-2 text-green-300">
            <span className="text-[0.7rem] lowercase tracking-wider">Executing</span>
            <span className="h-3 w-3 border-2 border-green-300 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Spacer so content doesn't overlap heading */}
      <div className="p-4">
        {results.map((res, idx) => {
          const { pageData } = res;
          const columns =
            pageData.data.length > 0
              ? Object.keys(pageData.data[0])
              : [];

          return (
            <div key={idx} className="mb-8">
              {/* Query */}
              <div className="text-green-400 mb-1">
                $ {res.query}
              </div>

              {/* Explanation */}
              <div className="text-gray-400 mb-2">
                {res.explanation}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="border border-[#333] text-green-300 w-full">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="border border-[#333] px-2 py-1 text-left"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.data.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {columns.map((col) => (
                          <td
                            key={col}
                            className="border border-[#333] px-2 py-1"
                          >
                            {String(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex gap-3 mt-2 text-gray-400">
                {pageData.page > 1 && (
                  <button
                    onClick={() =>
                      updatePage(idx, pageData.page - 1)
                    }
                  >
                    ← Prev
                  </button>
                )}

                {pageData.page < pageData.total_pages && (
                  <button
                    onClick={() =>
                      updatePage(idx, pageData.page + 1)
                    }
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default QueryOutputPanel;