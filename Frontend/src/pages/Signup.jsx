import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    let newErrors = { email: "", password: "" };
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      // Static placeholder (no API / auth logic yet)
      console.log("Signup clicked with:", { email, password });
      alert("Signup submitted (static UI only)");
    }
  };

  return (
    <div className="flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-[#eaeaea] text-center">
          Create your account
        </h2>

        <p className="mt-2 text-sm text-[#9ca3af] text-center">
          Sign up to start generating SQL queries
        </p>

        {/* Email */}
        <div className="mt-6">
          <label className="block text-sm text-[#eaeaea] mb-1">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#121212] border border-[#2a2a2a] text-[#eaeaea] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#333]"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="block text-sm text-[#eaeaea] mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-[#121212] border border-[#2a2a2a] text-[#eaeaea] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#333]"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-[#eaeaea] text-sm font-medium hover:bg-[#333] transition"
        >
          Sign Up
        </button>

        <p className="mt-4 text-xs text-[#6b7280] text-center">
          This is a demo signup form. No account will be created.
        </p>
      </div>
    </div>
  );
};

export default Signup;