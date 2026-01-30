import { useState } from "react";

const GeneratedQueryCard = ({ data,onExecute }) => {
  const [expanded, setExpanded] = useState(false);

  const copyQuery = () => {
    navigator.clipboard.writeText(data.query);
  };

  return (
    <div className="space-y-2 max-w-[85%]">
      {/* Response Card */}
      <div className="bg-[#232323] border border-[#2f2f2f] rounded-lg p-4 pb-6 text-xs relative">
        {/* Copy */}
        <button
          onClick={copyQuery}
          className="absolute top-1 right-3 text-[0.700rem] text-gray-400 hover:text-gray-200"
        >
          Copy
        </button>

        {/* Query */}
        <pre className="text-[#eaeaea] whitespace-pre-wrap pr-10">
          {data.query}
        </pre>

        {/* Expanded Info */}
        {expanded && (
          <div className="mt-3 text-xs text-gray-400 space-y-1">
            <p>
              <span className="text-gray-500">Type:</span> {data.language}
            </p>
            <p>
              <span className="text-gray-500">Details:</span> {data.details}
            </p>
          </div>
        )}

        {/* Show More / Less (bottom-right, fixed position) */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute bottom-1 right-3 text-[0.700rem] text-gray-400 hover:text-gray-200"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      </div>

      {/* Action Buttons (outside card) */}
      <div className="flex justify-end gap-2">
        <button 
          onClick={() =>
            onExecute({
              query: data.query,
              explanation: data.details,
              query_id:data.res_id,
            })
          }
          className="px-3 py-1.5 text-xs rounded-md bg-[#2d2d2d] hover:bg-[#3a3a3a] transition"
        >
          Execute
        </button>
        <button className="px-3 py-1.5 text-xs rounded-md bg-[#2d2d2d] hover:bg-[#3a3a3a] transition">
          Save
        </button>
      </div>
    </div>
  );
};

export default GeneratedQueryCard;