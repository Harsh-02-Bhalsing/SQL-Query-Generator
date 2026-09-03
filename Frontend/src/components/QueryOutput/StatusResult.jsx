/**
 * StatusResult
 * Generic success/confirmation renderer used for:
 *   DDL  — CREATE, DROP, ALTER, TRUNCATE, RENAME
 *   DCL  — GRANT, REVOKE
 *   TCL  — COMMIT, ROLLBACK, SAVEPOINT
 *
 * Props:
 *   result — the `result` object from the API envelope
 */

// Badge colour per SQL type
const TYPE_STYLES = {
  DDL: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  DCL: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  TCL: "bg-blue-500/15   text-blue-400   border-blue-500/30",
};

const StatusResult = ({ result }) => {
  const { type, message } = result;
  const badgeClass = TYPE_STYLES[type] ?? "bg-gray-500/15 text-gray-400 border-gray-500/30";

  return (
    <div className="mt-2 flex items-start gap-3">
      {/* Type badge */}
      <span
        className={`
          inline-flex items-center px-2 py-0.5 rounded-full
          text-[0.6rem] font-semibold uppercase tracking-wide border
          ${badgeClass}
          whitespace-nowrap self-start mt-0.5
        `}
      >
        {type}
      </span>

      {/* Message */}
      <div>
        <p className="text-green-300 font-semibold">
          ✓ {message}
        </p>
      </div>
    </div>
  );
};

export default StatusResult;