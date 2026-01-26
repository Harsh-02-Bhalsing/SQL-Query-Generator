import { useState } from "react";

const ErrorResponseCard = ({ data }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#232323] border border-[#2f2f2f] rounded-lg p-4 text-sm text-red-400 relative max-w-[85%]">
      <p>{data.error}</p>

      {expanded && (
        <p className="mt-3 text-xs text-gray-300">
          {data.suggestion}
        </p>
      )}

      {/* Show / Hide suggestion – fixed bottom-right */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute bottom-3 right-3 text-xs text-gray-400 hover:text-gray-200"
      >
        {expanded ? "Hide suggestion" : "Show suggestion"}
      </button>
    </div>
  );
};

export default ErrorResponseCard;