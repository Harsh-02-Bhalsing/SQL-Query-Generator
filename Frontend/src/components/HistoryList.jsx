import { useEffect, useState } from "react";
import HistoryItem from "./HistoryItem";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

const HistoryList = () => {
  const { userId } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const fetchHistory = async () => {
      try {
        // 🔐 Get Firebase ID token
        const token = await currentUser.getIdToken();

        const res = await fetch(`${API_BASE_URL}/api/queries/history`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // ✅ token in header
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch history");
        }

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

  if (loading)
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-xs text-gray-400">Loading query history…</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-xs text-red-400">{error}</p>
      </div>
    );

  if (!history.length)
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-2">
        <p className="text-sm text-gray-400">
          No query history yet
        </p>
        <p className="text-[0.7rem] text-gray-500">
          Your executed queries will appear here
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <HistoryItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default HistoryList;
