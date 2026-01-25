import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

const Login = () => {
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
  const { login } = useAuth();

  const handleLoginClick = async () => {
    let newErrors = { email: "", password: "", firebase: "" };
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
    if (!isValid) return;

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update Auth Context
      login(userCredential.user.email,userCredential.user.uid);
      setSuccess(true);

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      let message = "Something went wrong. Please try again.";
      console.log(error)
      if (error.code === "auth/invalid-credential") {
        message = "Invalid Credentials";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      }

      setErrors((prev) => ({ ...prev, firebase: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-[#eaeaea] text-center">
          Welcome back
        </h2>

        <p className="mt-2 text-sm text-[#9ca3af] text-center">
          Log in to continue using SQL Query Generator
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
            disabled={loading}
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
            disabled={loading}
            className="w-full px-4 py-2 rounded-md bg-[#121212] border border-[#2a2a2a] text-[#eaeaea] placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#333]"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Firebase Error */}
        {errors.firebase && (
          <p className="mt-4 text-sm text-red-500 text-center">
            {errors.firebase}
          </p>
        )}

        {/* Success Message */}
        {success && (
          <p className="mt-4 text-sm text-green-500 text-center">
            Login successful! Redirecting...
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleLoginClick}
          disabled={loading}
          className="mt-6 w-full px-4 py-2 rounded-md bg-[#2a2a2a] text-[#eaeaea] text-sm font-medium hover:bg-[#333] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="h-4 w-4 border-2 border-[#eaeaea] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            "Log In"
          )}
        </button>

        {/* Signup link */}
        <p className="mt-4 text-xs text-[#6b7280] text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#eaeaea] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;