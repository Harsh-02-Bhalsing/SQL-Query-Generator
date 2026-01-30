import HistoryList from "../components/HistoryList";

const HistoryPage = () => {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold text-gray-200">
          Query Execution History
        </h1>
        <p className="text-xs text-gray-500">
          Review previously executed queries and their results
        </p>
      </div>

      {/* History */}
      <HistoryList />
    </div>
  );
};

export default HistoryPage;
