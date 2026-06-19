/**
 * DMLResult
 * Renders the outcome of an INSERT / UPDATE / DELETE / MERGE statement.
 * Props:
 *   result — the `result` object from the API envelope (type === "DML")
 */
const DMLResult = ({ result }) => {
  const { affected_rows, message } = result;

  return (
    <div className="mt-2 flex items-start gap-3 text-green-300">
      {/* Icon */}
      <span className="text-lg leading-none">✓</span>

      <div>
        <p className="font-semibold">{message}</p>
        {affected_rows !== null && affected_rows !== undefined && (
          <p className="text-gray-400 text-[0.65rem] mt-0.5">
            {affected_rows} row{affected_rows !== 1 ? "s" : ""} affected
          </p>
        )}
      </div>
    </div>
  );
};

export default DMLResult;