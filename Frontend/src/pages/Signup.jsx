import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firebase: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    let newErrors = { email: "", password: "", firebase: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    try {
      setLoading(true);

      await createUserWithEmailAndPassword(auth, email, password);

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      }

      setErrors((prev) => ({ ...prev, firebase: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] px-6">
      <div className="w-full max-w-md relative">
        
        {/* Card */}
        <div
          className="
            relative
            bg-[#161616]/90
            backdrop-blur-xl
            border border-[#2a2a2a]
            rounded-2xl
            p-8
            shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          "
        >
          {/* Subtle glow */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 pointer-events-none" />

          <h2 className="text-2xl font-semibold text-white text-center tracking-tight">
            Create your account
          </h2>

          <p className="mt-2 text-sm text-gray-400 text-center">
            Sign up to start using <span className="text-gray-200">AskSQL</span>
          </p>

          {/* Email */}
          <div className="mt-8 space-y-1.5">
            <label className="text-xs uppercase tracking-wide text-gray-400">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="
                w-full
                px-4 py-2.5
                rounded-lg
                bg-[#0f0f0f]
                border border-[#2a2a2a]
                text-sm text-gray-200
                placeholder:text-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-white/10
                focus:border-white/20
                transition
              "
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mt-5 space-y-1.5">
            <label className="text-xs uppercase tracking-wide text-gray-400">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="
                w-full
                px-4 py-2.5
                rounded-lg
                bg-[#0f0f0f]
                border border-[#2a2a2a]
                text-sm text-gray-200
                placeholder:text-gray-500
                focus:outline-none
                focus:ring-2
                focus:ring-white/10
                focus:border-white/20
                transition
              "
            />
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Firebase Error */}
          {errors.firebase && (
            <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
              <p className="text-xs text-red-400 text-center">
                {errors.firebase}
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-5 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2">
              <p className="text-xs text-green-400 text-center">
                Account created successfully! Redirecting…
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              mt-7 w-full
              h-10
              rounded-lg
              bg-gradient-to-r from-gray-200 to-gray-400
              text-black
              text-sm font-semibold
              hover:from-white hover:to-gray-300
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
              shadow-md
            "
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Login link */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-gray-200 hover:text-white transition underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
