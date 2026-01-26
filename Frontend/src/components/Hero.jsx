const Hero = () => {
  return (
    <section className="bg-[#121212]">
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-[#eaeaea] leading-tight">
          Ask Questions in English.  
          <br className="hidden md:block" />
          Get SQL Instantly.
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-[#9ca3af] text-lg">
          Convert natural language into accurate SQL queries using AI.
          Explore databases, understand queries, and get results without
          writing complex SQL.
        </p>

        <div className="mt-10">
          <a
            href="/signup"
            className="inline-block px-6 py-3 rounded-md bg-[#2a2a2a] text-[#eaeaea] text-sm font-medium hover:bg-[#333] transition"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;