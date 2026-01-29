import { useState } from "react";

const SavedQueryCell = ({ query, onExecute, onDeleted }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

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

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:8000/api/queries/${query.query_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: query.user_id }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to delete query");
      }

      onDeleted?.(); // refresh list
      setShowConfirm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
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
            <button
              onClick={() => setShowConfirm(true)}
              className="px-2 py-1 rounded bg-[#2d2d2d] flex items-center gap-1 text-[0.65rem] text-red-400 hover:text-red-300"
            >
              🗑 Delete
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


      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] border border-[#2f2f2f] rounded-lg p-4 w-[320px] space-y-3">
            <p className="text-xs text-gray-300">
              This will delete <span className="text-white font-medium">
              {query.title || "this query"}
              </span>
            </p>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 text-xs rounded bg-[#2a2a2a]"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default SavedQueryCell;