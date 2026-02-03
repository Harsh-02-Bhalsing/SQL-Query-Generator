const features = [
  {
    title: "Natural Language → SQL",
    description:
      "Describe what you want in plain English. AskSQL converts it into clean, optimized SQL instantly.",
    accent: "from-indigo-400 to-cyan-400",
  },
  {
    title: "Instant Execution",
    description:
      "Run generated queries safely on the database and view structured results in real time.",
    accent: "from-cyan-400 to-emerald-400",
  },
  {
    title: "Save & Reuse Queries",
    description:
      "Store important queries with titles and explanations. Re-run or modify them anytime.",
    accent: "from-emerald-400 to-lime-400",
  },
  {
    title: "Schema Awareness",
    description:
      "Inspect database tables and columns so your questions are always accurate and informed.",
    accent: "from-purple-400 to-pink-400",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="bg-[#0f0f0f] border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 py-28">
        <h3 className="text-3xl md:text-4xl font-semibold text-white text-center">
          Built for Real-World Data Work
        </h3>

        <p className="mt-4 text-center text-gray-400 max-w-xl mx-auto text-sm">
          A complete workflow — from understanding your database to generating,
          executing, and managing SQL queries.
        </p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
                relative
                bg-[#141414]
                border border-white/10
                rounded-2xl
                p-6
                transition
                hover:border-white/20
                hover:-translate-y-1
              "
            >
              {/* Accent bar */}
              <div
                className={`h-1 w-12 rounded-full bg-gradient-to-r ${feature.accent} mb-4`}
              />

              <h4 className="text-lg font-medium text-white">
                {feature.title}
              </h4>

              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
