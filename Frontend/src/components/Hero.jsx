const Hero = () => {
  return (
    <section className="relative bg-[#0b0b0b] overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 
        bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]
        bg-[size:40px_40px]
        opacity-20
      " />

      {/* Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full 
        bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-purple-500/20 blur-3xl
      " />

      <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
        <span className="inline-block mb-4 text-xs uppercase tracking-widest text-gray-400">
          AI Powered SQL Assistant
        </span>

        <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight tracking-tight">
          From English  
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-indigo-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
            To Production-Ready SQL
          </span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-gray-400 text-base md:text-lg leading-relaxed">
          AskSQL understands your database, translates intent into SQL,
          executes queries safely, and helps you explore data with confidence.
        </p>

        <div className="mt-12 flex items-center justify-center gap-4">
          <a
            href="/signup"
            className="
              px-7 py-3 rounded-xl
              bg-white text-black
              text-sm font-semibold
              hover:bg-gray-200 transition
              shadow-lg
            "
          >
            Get Started
          </a>

          <a
            href="#features"
            className="
              px-7 py-3 rounded-xl
              border border-white/20
              text-sm font-medium text-gray-200
              hover:bg-white/5 transition
            "
          >
            See Features
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
