import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import QueryDescriptionPanel from "../components/QueryDescriptionPanel";
import QueryOutputPanel from "../components/QueryOutputPanel";
import { API_BASE_URL } from "../config/api";

const QueryDetailPage = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const { currentUser } = useAuth();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);


  const [query, setQuery] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueryDetail = async () => {

      const token = await currentUser.getIdToken();

      try {
        const res = await fetch(`${API_BASE_URL}/api/queries/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, }
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Failed to load query");
        }

        setQuery(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQueryDetail();
  }, [id, userId]);

  const handleExecute = () => {
    if (!query) return;

    setExecutions((prev) => [
      ...prev,
      {
        query: query.sql_query,
        explanation: query.details,
        query_id:query.query_id,
      },
    ]);
  };

  if (loading) {
    return <p className="text-xs text-gray-400 p-4">Loading query…</p>;
  }

  if (error) {
    return <p className="text-xs text-red-500 p-4">{error}</p>;
  }

  return (
    <div className="h-screen flex gap-1 p-0 bg-[#1e1e1e] text-white">

      {/* Left: Description */}
      {isDescriptionOpen ? (
        <div className="w-[30%] min-w-[280px] relative">
          {/* Collapse button */}
          <button
            onClick={() => setIsDescriptionOpen(false)}
            className="absolute top-1.5 left-2 z-20
                      h-5 w-5 flex items-center justify-center
                      rounded-full bg-[#2a2a2a]
                      text-gray-400 hover:text-white "
            title="Collapse description"
          >
            📄
          </button>

          <QueryDescriptionPanel
            query={query}
            onExecute={handleExecute}
          />
        </div>
      ) : (
        <div
          className="w-8 bg-[#252526] border border-[#333]
                    flex items-center justify-center
                    cursor-pointer hover:bg-[#2d2d2d]"
          onClick={() => setIsDescriptionOpen(true)}
        >
          <span className="text-xs tracking-widest
                          rotate-180 [writing-mode:vertical-rl]
                          text-gray-400">
            QUERY
          </span>
        </div>
      )}

      {/* Right: Output */}
      <div className="flex-1 min-w-0">
        <QueryOutputPanel executions={executions} />
      </div>

    </div>
  );

};

export default QueryDetailPage;
