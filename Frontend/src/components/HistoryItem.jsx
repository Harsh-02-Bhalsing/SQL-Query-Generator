import { useState } from "react";

const HistoryItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="
        relative
        rounded-lg
        border border-[#2a2a2a]
        bg-gradient-to-br from-[#1c1c1c] to-[#161616]
        p-4
        space-y-2
        transition-all duration-200
        hover:border-green-500/30
        hover:shadow-[0_0_12px_rgba(34,197,94,0.08)]
      "
    >
      {/* Accent line */}
      <div className="absolute left-0 top-0 h-full w-[2px] bg-green-500/40 rounded-l-lg" />

      {/* SQL Query */}
      <div className="pl-2">
        <p
          className={`
            text-[0.8rem] font-mono text-gray-200
            ${expanded ? "whitespace-pre-wrap" : "line-clamp-1"}
          `}
        >
          {item.sql_query}
        </p>

        {/* Expand / Collapse */}
        {item.sql_query.length > 120 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-[0.65rem] text-gray-400 hover:text-green-400 transition"
          >
            {expanded ? "Show less" : "⋯ Show more"}
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3 text-[0.75rem] text-gray-400 pl-2">
        <span>
          Rows: <span className="text-gray-300">{item.total_rows}</span>
        </span>
        <span>•</span>
        <span>
          Pages: <span className="text-gray-300">{item.total_pages}</span>
        </span>
      </div>

      {/* Timestamp */}
      <p className="text-[0.7rem] text-green-500 pl-2">
        Executed on{" "}
        {new Date(item.executed_at).toLocaleString()}
      </p>
    </div>
  );
};

export default HistoryItem;
