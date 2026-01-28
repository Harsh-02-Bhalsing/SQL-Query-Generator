import { useEffect, useState } from "react";

const PAGE_SIZE = 20;

const QueryOutputPanel = ({ executions }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (executions.length === 0) return;

    const last = executions[executions.length - 1];
    executeQuery(last.query, last.explanation, 1);
  }, [executions]);

  const executeQuery = async (query, explanation, page) => {
    const res = await fetch("http://localhost:8000/api/queries/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        page,
        page_size: PAGE_SIZE,
      }),
    });

    const data = await res.json();

    setResults((prev) => [
      ...prev,
      {
        query,
        explanation,
        pageData: data,
      },
    ]);
  };

  const updatePage = async (index, nextPage) => {
    const item = results[index];

    const res = await fetch("http://localhost:8000/api/queries/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
    <div className="h-full rounded-md bg-black border border-[#333] p-4 font-mono text-xs overflow-y-auto">
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
    </div>
  );
};

export default QueryOutputPanel;