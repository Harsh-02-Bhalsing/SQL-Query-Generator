import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const GeneratedQueryCard = ({ data, onExecute }) => {
  const { userId } = useAuth();

  const [expanded, setExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saved
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [title, setTitle] = useState("");

  const copyQuery = () => {
    navigator.clipboard.writeText(data.query);
  };

  /* ---------- API Call ---------- */
  const saveQuery = async (titleValue) => {
    
    const response = await fetch("http://localhost:8000/api/queries/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query_id: data.res_id,
        user_id: userId,
        natural_language_query: data.natural_language_query,
        sql_query: data.query,
        title: titleValue,
        language: data.language,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || "Failed to save query");
    }

    return result;
  };

  /* ---------- Handle Save ---------- */
  const handleSave = async () => {
    setIsSaving(true);

    try {
      await saveQuery(title);
      setSaveStatus("saved");

      // Reset state after 5 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 5000);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsSaving(false);
      setShowTitleModal(false);
      setTitle("");
    }
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

        {/* Show More / Less */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute bottom-1 right-3 text-[0.700rem] text-gray-400 hover:text-gray-200"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() =>
            onExecute({
              query: data.query,
              explanation: data.details,
            })
          }
          className="px-3 py-1.5 text-xs rounded-md bg-[#2d2d2d] hover:bg-[#3a3a3a] transition"
        >
          Execute
        </button>

        <button
          onClick={() => setShowTitleModal(true)}
          disabled={isSaving}
          className="px-3 py-1.5 text-xs rounded-md bg-[#2d2d2d] hover:bg-[#3a3a3a] transition disabled:opacity-50"
        >
          {isSaving ? "Saving..." : saveStatus === "saved" ? "Saved" : "Save"}
        </button>
      </div>

      {/* Title Modal */}
      {showTitleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] border border-[#2f2f2f] rounded-lg p-4 w-[300px] space-y-3">
            <h3 className="text-sm text-white">Save Query</h3>

            <input
              type="text"
              placeholder="Enter title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-md px-3 py-2 text-xs text-white focus:outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowTitleModal(false)}
                className="px-3 py-1.5 text-xs rounded-md bg-[#2a2a2a] hover:bg-[#333]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-xs rounded-md bg-[#3a3a3a] hover:bg-[#444]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedQueryCard;