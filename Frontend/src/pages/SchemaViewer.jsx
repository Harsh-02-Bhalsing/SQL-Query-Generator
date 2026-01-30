import { useEffect, useState } from "react";

const SchemaViewer = () => {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/database/schema");
        const data = await res.json();
        setSchema(data);
      } catch {
        setError("Failed to load database schema");
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, []);

  if (loading)
    return <p className="text-xs text-gray-400">Loading schema…</p>;

  if (error)
    return <p className="text-xs text-red-400">{error}</p>;

  return (
    <div className="m-8">
      {/* Grid of tables */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(schema.tables).map(([tableName, table]) => (
          <div
            key={tableName}
            className="
              rounded-xl
              border border-[#2a2a2a]
              bg-gradient-to-br from-[#1c1c1c] to-[#151515]
              overflow-hidden
            "
          >
            {/* Table Header */}
            <div className="px-4 py-2 bg-[#181818] border-b border-[#2a2a2a]">
              <h3 className="text-base font-semibold text-green-400 text-center tracking-wide">
                {tableName}
              </h3>
            </div>

            {/* Columns */}
            <div className="p-4 space-y-2">
              {Object.entries(table.columns).map(([colName, col]) => (
                <div
                  key={colName}
                  className="
                    grid grid-cols-[1fr_auto]
                    items-center
                    px-10
                    text-xs
                    font-mono
                    text-gray-300
                  "
                >

                  {/* Column name */}
                  <span className="truncate text-sm text-gray-200">
                    {colName}
                  </span>

                  {/* Column metadata */}
                  <div className="flex items-center gap-2 text-[0.7rem] text-gray-500 justify-end">
                      <span className="text-gray-400">{col.type}</span>


                    {col.primary_key && (
                      <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400">
                        PK
                      </span>
                    )}

                    {col.unique && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                        UNIQUE
                      </span>
                    )}

                    {col.foreign_key && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 truncate">
                        FK
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaViewer;
