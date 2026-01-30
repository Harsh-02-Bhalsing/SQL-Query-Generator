import HistoryList from "../components/HistoryList";

const HistoryPage = () => {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-semibold text-gray-200">
        Query Execution History
      </h1>

      <HistoryList />
    </div>
  );
};

export default HistoryPage;
