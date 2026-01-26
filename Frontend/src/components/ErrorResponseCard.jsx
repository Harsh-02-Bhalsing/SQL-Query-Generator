import { useState } from "react";

const ErrorResponseCard = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#252526] border border-[#333] rounded-md p-4 text-sm text-red-400">
      <p>{data.error}</p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-xs text-gray-400 hover:text-white"
      >
        {expanded ? "Hide suggestion" : "Show suggestion"}
      </button>

      {expanded && (
        <p className="mt-2 text-xs text-gray-300">{data.suggestion}</p>
      )}
    </div>
  );
};

export default ErrorResponseCard;