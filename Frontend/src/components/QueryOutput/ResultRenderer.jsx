import DQLResult   from "./DQLResult";
import DMLResult   from "./DMLResult";
import StatusResult from "./StatusResult";

/**
 * ResultRenderer
 * Reads `query_type` from the API envelope and delegates rendering
 * to the appropriate sub-component.
 *
 * Props:
 *   queryType      — "DQL" | "DML" | "DDL" | "DCL" | "TCL"
 *   result         — the `result` object from the API envelope
 *   onPageChange   — (nextPage: number) => void   [DQL only]
 */
const ResultRenderer = ({ queryType, result, onPageChange }) => {
  switch (queryType) {
    case "DQL":
      return <DQLResult result={result} onPageChange={onPageChange} />;

    case "DML":
      return <DMLResult result={result} />;

    case "DDL":
    case "DCL":
    case "TCL":
      return <StatusResult result={result} />;

    default:
      return (
        <p className="text-red-400 mt-2">
          Unknown query type: <strong>{queryType}</strong>
        </p>
      );
  }
};

export default ResultRenderer;