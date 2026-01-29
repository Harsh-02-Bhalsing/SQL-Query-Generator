import { useState } from "react";

const SavedQueryCell = ({ query, onExecute }) => {
  const [expanded, setExpanded] = useState(false);

  const copyQuery = () => {
    navigator.clipboard.writeText(query.sql_query);
  };

  const handleExecute = () => {
    onExecute({
      query: query.sql_query,
      explanation: query.natural_language_query,
    });
  };

  return (
    <div
      className={`border border-[#2f2f2f] rounded-md bg-[#232323] p-3 text-xs transition-all duration-300 ${
        expanded ? "space-y-3" : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-gray-200 font-medium break-words">
            {query.title || "Untitled Query"}
          </p>
          <p className="text-gray-400 break-words">
            {query.sql_query}
          </p>
        </div>

        <button
          onClick={copyQuery}
          className="text-[0.65rem] text-gray-400 hover:text-gray-200"
        >
          Copy
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="text-gray-400 space-y-2">
          <p>
            <span className="text-gray-500">Natural language:</span>{" "}
            {query.natural_language_query}
          </p>

          <p>
            <span className="text-gray-500">Created:</span>{" "}
            {new Date(query.created_at).toLocaleString()}
          </p>

          <p>
            <span className="text-gray-500">Details:</span>{" "}
            {query.details}
          </p>

          <div className="flex gap-2 pt-2">
            <button
              className="px-2 py-1 rounded bg-[#2d2d2d] hover:bg-[#3a3a3a]"
            >
              View details
            </button>

            <button
              onClick={handleExecute}
              className="px-2 py-1 rounded bg-[#2d2d2d] hover:bg-[#3a3a3a]"
            >
              Execute
            </button>
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-[0.65rem] text-gray-400 hover:text-gray-200"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
};

export default SavedQueryCell;