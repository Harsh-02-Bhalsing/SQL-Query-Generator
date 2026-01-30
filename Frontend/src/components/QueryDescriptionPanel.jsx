import React from "react";

const QueryDescriptionPanel = ({ query, onExecute }) => {
  if (!query) return null;

  const queryType = "DQL"; // static for now (can be inferred later)

  return (
    <div className="h-full w-full rounded-md bg-[#262626] border border-[#333] overflow-hidden flex flex-col">

      {/* Header Strip */}
      <div className="
        h-9
        sticky top-0 z-10
        flex items-center justify-between
        bg-[#1f1f1f]
        border-b border-[blue]
        px-3 py-0.5
        text-[0.75rem] uppercase tracking-wider
        text-white-300
        bg-[#333333]
        font-bold
      ">
        <span className="pl-6">Description</span>

        {/* Execute Button */}
        <button
          onClick={onExecute}
          className="
            h-6 px-2
            flex items-center gap-1
            rounded-md
            border border-green-500/40
            text-sm font-medium text-green-400
            hover:text-green-300
            hover:bg-green-500/10
            hover:shadow-[0_0_8px_rgba(34,197,94,0.6)]
            transition-all duration-200
          "
          title="Execute query"
        >
          ▶︎
          <span>Execute</span>
        </button>


      </div>

      {/* Content */}
      <div className="p-4 space-y-6 text-xs text-gray-300 overflow-y-auto custom-scrollbar">


        {/* Title */}
        <h2 className="text-xl font-semibold text-[white]">
          {query.title || "Untitled Query"}
        </h2>

        {/* Meta badges */}
        <div className="flex gap-3">
          <span className="px-3 py-0.5 rounded-full bg-[#3c3c3c] text-green-400">
            <span className="">{queryType}</span>
          </span>
          <span className="px-3 py-0.5 rounded-full bg-[#3c3c3c] text-yellow-400 ">
            {new Date(query.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-[1rem] text-[#ffffff]">Description :</p>
          <p className="text-[0.8rem] text-[#a8a8a8]">
            {query.details || "No description available."}
          </p>
        </div>

        {/* SQL Query */}
        <div className="space-y-2">
          <p className="text-[1rem] text-[#ffffff]">SQL Query</p>
          <pre className="bg-black border border-[#333] rounded p-2 text-green-400 overflow-x-auto">
            {query.sql_query}
          </pre>
        </div>

        {/* Natural Language Query */}
        <div className="space-y-2">
          <p className="text-[1rem] text-[#ffffff]">Natural Language Query</p>
          <p className="italic text-[0.9rem] text-[#a8a8a8]">
            {query.natural_language_query}
          </p>
        </div>

      </div>
    </div>
  );
};

export default QueryDescriptionPanel;
