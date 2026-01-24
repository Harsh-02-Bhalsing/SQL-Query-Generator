const features = [
  {
    title: "Natural Language to SQL",
    description:
      "Write queries in plain English and let AI convert them into optimized SQL.",
  },
  {
    title: "Instant Query Execution",
    description:
      "Run generated SQL queries on a sample database and view results instantly.",
  },
  {
    title: "Save & Reuse Queries",
    description:
      "Store important queries, revisit them anytime, and rerun with one click.",
  },
  {
    title: "Understand Your Data",
    description:
      "View database schema and get explanations for generated SQL queries.",
  },
];

const Features = () => {
  return (
    <section id="features" className="bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-semibold text-[#eaeaea] text-center">
          Key Features
        </h3>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#333] transition"
            >
              <h4 className="text-lg font-medium text-[#eaeaea]">
                {feature.title}
              </h4>
              <p className="mt-3 text-sm text-[#9ca3af] leading-relaxed">
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