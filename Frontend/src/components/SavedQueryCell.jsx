import { useState } from "react";
import { useNavigate } from "react-router-dom";
const SavedQueryCell = ({ query, onExecute, onDeleted }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const copyQuery = () => {
    navigator.clipboard.writeText(query.sql_query);
  };

  const handleViewDetails = () => {
    navigate(`/queries/${query.query_id}`);
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
      className="border border-[#2f2f2f] rounded-md bg-[#232323] p-3 text-xs transition-all duration-300 space-y-3"
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

  
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleViewDetails}
              className="px-2 py-1 rounded bg-[#2d2d2d] hover:bg-[#3a3a3a] text-yellow-400"
            >
              View details
            </button>


            <button
              onClick={handleExecute}
              className="px-2 py-1 rounded bg-[#2d2d2d] hover:bg-[#3a3a3a] text-green-400"
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