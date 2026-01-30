import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
const PAGE_SIZE = 20;

const QueryOutputPanel = ({ executions }) => {
  const [results, setResults] = useState([]);
  const bottomRef = useRef(null);
  const { userId } = useAuth();

  useEffect(() => {
    if (executions.length === 0) return;
    const last = executions[executions.length - 1];
    executeQuery(userId,last.query_id,last.query, last.explanation, 1);
  }, [executions]);
  useEffect(() => {
    if (!bottomRef.current) return;
    
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [results]);

  const executeQuery = async (userId,query_id,query, explanation, page) => {
    console.log(userId,"and",query_id)
    const res = await fetch("http://localhost:8000/api/queries/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id:userId,
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
  };

  const updatePage = async (index, nextPage) => {
    const item = results[index];
    console.log(userId,item.query_id)
    const res = await fetch("http://localhost:8000/api/queries/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id:userId,
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
        text-[0.75rem] uppercase tracking-wider
        text-green-300
        font-bold
      ">
        Output
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