import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import SavedQueryCell from "./SavedQueryCell";

const SavedQueries = ({ onExecute, refreshKey }) => {
  const { userId } = useAuth();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchSavedQueries = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/queries",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
            }),
          }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Failed to load saved queries");
        }

        setQueries(data.queries || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedQueries();
  }, [userId,refreshKey]);

  return (
    <div className="flex flex-col w-full h-full p-3 gap-3 overflow-y-auto">
      <h2 className="flex items-center gap-2 text-[.850rem] uppercase tracking-wider font-semibold">
        <span className="text-gray-400">📂</span>
        <span className="bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">
          Saved Queries
        </span>
      </h2>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-gray-400 animate-pulse">
          <span>⏳</span>
          <span>Loading saved queries…</span>
        </div>
      )}

      {!loading && queries.length === 0 && (
        <div className="flex flex-1 items-center justify-center text-center">
          <div className="flex flex-col gap-1 text-xs text-gray-400">
            <div className="text-gray-300 font-medium">
              No saved queries yet
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {queries.map((query) => (
        <SavedQueryCell
          key={query.query_id}
          query={query}
          onExecute={onExecute}
          onDeleted={() => setQueries((q) =>
            q.filter((item) => item.query_id !== query.query_id)
          )}
        />
      ))}
    </div>
  );
};

export default SavedQueries;