import { useState } from "react";

const GeneratedQueryCard = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  const copyQuery = () => {
    navigator.clipboard.writeText(data.query);
  };

  return (
    <div className="bg-[#252526] border border-[#333] rounded-md p-4 text-sm">
      <div className="flex justify-between items-start">
        <pre className="text-[#eaeaea] whitespace-pre-wrap">
          {data.query}
        </pre>

        <button
          onClick={copyQuery}
          className="text-xs text-gray-400 hover:text-white"
        >
          Copy
        </button>
      </div>

      <div className="flex gap-3 mt-3">
        <button className="px-3 py-1 text-xs bg-[#2a2a2a] rounded hover:bg-[#333]">
          Execute
        </button>
        <button className="px-3 py-1 text-xs bg-[#2a2a2a] rounded hover:bg-[#333]">
          Save
        </button>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-xs text-gray-400 hover:text-white"
      >
        {expanded ? "Show less" : "Show more"}
      </button>

      {expanded && (
        <div className="mt-2 text-xs text-gray-400 space-y-1">
          <p>
            <span className="text-gray-500">Type:</span> {data.language}
          </p>
          <p>
            <span className="text-gray-500">Details:</span> {data.details}
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneratedQueryCard;