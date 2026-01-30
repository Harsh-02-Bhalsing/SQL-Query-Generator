import { useEffect, useState } from "react";
import HistoryItem from "./HistoryItem";
import { useAuth } from "../context/AuthContext";

const HistoryList = () => {
  const { userId } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/queries/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        const data = await res.json();
        setHistory(data.history);
      } catch {
        setError("Failed to load query history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  if (loading) return <p className="text-xs text-gray-400">Loading history…</p>;
  if (error) return <p className="text-xs text-red-400">{error}</p>;
  if (!history.length)
    return <p className="text-xs text-gray-500">No query history yet.</p>;

  return (
    <div className="space-y-3">
      {history.map((item) => (
        <HistoryItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default HistoryList;
