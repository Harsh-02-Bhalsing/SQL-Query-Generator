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
      <h2 className="text-xs uppercase tracking-wider text-gray-400">
        Saved Queries
      </h2>

      {loading && (
        <p className="text-xs text-gray-500">Loading saved queries…</p>
      )}

      {!loading && queries.length === 0 && (
        <p className="text-xs text-gray-500">
          No saved queries yet. Save one to see it here.
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {queries.map((query) => (
        <SavedQueryCell
          key={query.query_id}
          query={query}
          onExecute={onExecute}
        />
      ))}
    </div>
  );
};

export default SavedQueries;