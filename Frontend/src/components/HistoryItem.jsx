const HistoryItem = ({ item }) => {
  return (
    <div className="border border-[#2a2a2a] rounded-md p-3 bg-[#1f1f1f] space-y-1">
      <p className="text-xs text-gray-200 truncate">
        {item.sql_query}
      </p>

      <p className="text-[0.7rem] text-gray-400">
        Rows: {item.total_rows} • Pages: {item.total_pages}
      </p>

      <p className="text-[0.65rem] text-gray-500">
        {new Date(item.executed_at).toLocaleString()}
      </p>
    </div>
  );
};

export default HistoryItem;
