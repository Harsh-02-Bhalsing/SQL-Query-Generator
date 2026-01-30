import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import GeneratedQueryCard from "./GeneratedQueryCard";
import ErrorResponseCard from "./ErrorResponseCard";

const QueryInputPanel = ({ onExecute,onSaved }) => {

  const { userId } = useAuth();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);


  const greetings = [
    "👋 Welcome back! Ready to turn thoughts into SQL?",
    "🧠 Think it. Type it. Query it.",
    "💡 What data mystery are we solving today?",
    "📊 From plain English to perfect SQL — let’s go!",
    "🚀 Ask me anything… I speak fluent SQL.",
    "😄 Coffee in hand? Let’s query some data!"
  ];

  const [randomGreeting] = useState(() =>
    greetings[Math.floor(Math.random() * greetings.length)]
  );



  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
      chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  /* ---------------- Mock API ---------------- */
  const sendQueryToBackend = async ({ user_id,query }) => {
    

    const response = await fetch("http://localhost:8000/api/queries/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query:query,
        user_id:userId // ✅ ONLY query
      }),
    });


    const data = await response.json();


    if (!response.ok) {
      throw new Error(data.detail || "Failed to generate SQL");
    }


    return data;
    
  };

  /* ---------------- Submit Handler ---------------- */
  const handleSubmit = async () => {
    if (!input.trim()) {
      setError("Query cannot be empty");
      return;
    }

    setError("");
    const userMessage = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { type: "user", text: userMessage },
      { type: "loading"},
    ]);

    setLoading(true);

    try {
      const response = await sendQueryToBackend({
        query: userMessage,
        userId:userId
      });
      
      setMessages((prev) =>
        prev
          .filter((msg) => msg.type !== "loading")
          .concat({
            type: "bot",
            response,
          })
      );
    } catch(err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-full flex flex-col bg-[#1c1c1c] rounded-lg border border-[#2a2a2a] ">
      {/* Chat Area */}
      
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-5"
      >
        {messages.length === 0 && !loading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                {randomGreeting}
              </p>
              <p className="text-[0.7rem] text-gray-500">
                Try something like: <span className="italic">“Show top 5 artists by album count”</span>
              </p>
            </div>
          </div>
        )}
        {messages.map((msg, idx) => {
          if (msg.type === "user") {
            return (
              <div
                key={idx}
                className="self-end max-w-[80%] bg-[#2a2a2a] px-4 py-2 rounded-lg text-xs"
              >
                {msg.text}
              </div>
            );
          }

          if (msg.type === "loading") {
            return (
              <div key={idx} className="text-xs text-gray-400">
                Generating SQL…
              </div>
            );
          }

          if (msg.type === "bot") {
            return msg.response.status === 1 ? (
              <GeneratedQueryCard key={idx} data={msg.response.data} onExecute={onExecute} onSaved={onSaved}/>
            ) : (
              <ErrorResponseCard key={idx} data={msg.response.data} />
            );
          }

          return null;
        })}
      </div>
      

      {/* Input Area */}
      <div className="px-10 pb-3 flex items-center justify-center">
        <div className="flex items-center gap-3 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%]">
          
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your question in natural language..."
            disabled={loading}
            className="flex-1 bg-[#121212] border border-[#2a2a2a] 
                      rounded-full px-5 py-2.5 text-xs text-[#eaeaea]
                      placeholder-[#6b7280] focus:outline-none 
                      focus:ring-1 focus:ring-[#444]"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-9 w-9 flex items-center justify-center
                      rounded-full bg-[#2a2a2a] hover:bg-[#333]
                      text-gray-300 hover:text-white
                      transition disabled:opacity-50"
            aria-label="Send"
          >
            ➤
          </button>

        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 px-4 pb-2">{error}</p>
      )}
    </div>
  );
};

export default QueryInputPanel;