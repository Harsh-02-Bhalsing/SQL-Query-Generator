/**
 * DQLResult
 * Renders a paginated data table for SELECT query results.
 * Props:
 *   result     — the `result` object from the API envelope (type === "DQL")
 *   onPageChange(nextPage) — called when the user clicks Prev / Next
 */
const DQLResult = ({ result, onPageChange }) => {
  const { columns = [], data = [], page, total_pages, total_rows, returned_rows } = result;

  if (data.length === 0) {
    return (
      <p className="text-gray-500 italic mt-1">
        Query executed successfully — no rows returned.
      </p>
    );
  }

  return (
    <div className="mt-2">
      {/* Stats row */}
      <div className="flex gap-4 text-gray-500 text-[0.65rem] mb-1">
        <span>{returned_rows} rows on this page</span>
        <span>{total_rows} total</span>
        <span>page {page} / {total_pages}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="border border-[#333] text-green-300 w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="border border-[#333] px-2 py-1 text-left whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-[#0f1f0f]">
                {columns.map((col) => (
                  <td key={col} className="border border-[#333] px-2 py-1 whitespace-nowrap">
                    {row[col] === null ? (
                      <span className="text-gray-600 italic">NULL</span>
                    ) : (
                      String(row[col])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex gap-4 mt-2 text-gray-400">
        {page > 1 && (
          <button
            onClick={() => onPageChange(page - 1)}
            className="hover:text-green-300 transition"
          >
            ← Prev
          </button>
        )}
        {page < total_pages && (
          <button
            onClick={() => onPageChange(page + 1)}
            className="hover:text-green-300 transition"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default DQLResult;