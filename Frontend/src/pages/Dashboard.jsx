import { useState } from "react";
import SavedQueries from "../components/SavedQueries";
import QueryInputPanel from "../components/QueryInputPanel";
import QueryOutputPanel from "../components/QueryOutputPanel";

const Dashboard = () => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(25); // %
  const [topHeight, setTopHeight] = useState(40); // %
  const [executions, setExecutions] = useState([]);
  const [refreshSavedQueries, setRefreshSavedQueries] = useState(0);

  const handleExecuteQuery = (payload) => {
    setExecutions((prev) => [...prev, payload]);
  };
  /* ---------- Vertical resize (input/output) ---------- */
  const startVerticalResize = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = topHeight;

    const onMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const percentDelta = (deltaY / window.innerHeight) * 100;
      setTopHeight(Math.min(70, Math.max(20, startHeight + percentDelta)));
    };

    const stop = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stop);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stop);
  };

  /* ---------- Horizontal resize (sidebar) ---------- */
  const startSidebarResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const percentDelta = (deltaX / window.innerWidth) * 100;
      setSidebarWidth(Math.min(45, Math.max(20, startWidth + percentDelta)));
    };

    const stop = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", stop);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stop);
  };

  return (
    <div className="h-screen flex bg-[#1e1e1e] text-white">
      {/* Sidebar */}
      {isSidebarOpen ? (
        <div
          style={{ width: `${sidebarWidth}%` }}
          className="bg-[#252526] border-r border-[#333] relative flex"
        >
          <SavedQueries
            onExecute={handleExecuteQuery}
            refreshKey={refreshSavedQueries}
          />

          {/* Collapse button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-2 right-2 text-sm text-gray-400 hover:text-white"
          >
            ⟨
          </button>

          {/* Sidebar resize handle */}
          <div
            onMouseDown={startSidebarResize}
            className="absolute top-0 right-0 h-full w-[4px] cursor-col-resize bg-transparent hover:bg-[blue]"
          />
        </div>
      ) : (
        <div
          className="w-8 bg-[#252526] border-r border-[#333] flex items-center justify-center cursor-pointer hover:bg-[#2d2d2d]"
          onClick={() => setIsSidebarOpen(true)}
        >
          <span className="text-xs tracking-widest rotate-180 [writing-mode:vertical-rl] text-gray-400">
            SAVED QUERIES
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Input Section */}
        <div style={{ height: `${topHeight}%` }} >
          <QueryInputPanel
            onExecute={handleExecuteQuery}
            onSaved={() => setRefreshSavedQueries((v) => v + 1)}
          />
        </div>

        {/* Minimal divider */}
        <div
          onMouseDown={startVerticalResize}
          className="h-[2px] bg-[#red] cursor-row-resize hover:bg-[blue]"
        />

        {/* Output Section */}
        <div className="flex-1 p-0 min-h-0 overflow-hidden">
          <QueryOutputPanel executions={executions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;