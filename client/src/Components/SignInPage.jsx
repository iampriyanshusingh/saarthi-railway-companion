import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import LucidIcon from "./LucidIcon";

const SignInPage = () => {
  const [isSignIn, setIsSignIn] = useState(true); // State to toggle between Sign In and Sign Up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    console.log("Attempting to sign in with:", { email, password });
    alert("Sign-in attempt (check console for details)");
    // In a real app, you'd send this to your authentication API
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Attempting to sign up with:", { username, email, password });
    alert("Sign-up attempt (check console for details)");
    // In a real app, you'd send this to your registration API
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-[calc(100vh-120px)] p-4 animate-fade-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-900 p-8 md:p-10 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-6 md:mb-8 text-center">
          {isSignIn ? "Sign In to Saarthi" : "Sign Up for Saarthi"}
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6 md:mb-8">
          <button
            onClick={() => setIsSignIn(true)}
            className={`px-6 py-2 rounded-l-lg font-semibold transition-all duration-200 text-lg
              ${
                isSignIn
                  ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`px-6 py-2 rounded-r-lg font-semibold transition-all duration-200 text-lg
              ${
                !isSignIn
                  ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-md"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
          >
            Sign Up
          </button>
        </div>

        {isSignIn ? (
          // Sign In Form
          <form onSubmit={handleSignInSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <LucidIcon
                  name="Mail"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <LucidIcon
                  name="Lock"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg flex items-center justify-center"
            >
              <LucidIcon name="LogIn" className="w-6 h-6 mr-2" /> Sign In
            </button>
            <p className="text-center text-gray-400 text-sm mt-4">
              Forgot password?{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Reset here
              </a>
            </p>
          </form>
        ) : (
          // Sign Up Form
          <form onSubmit={handleSignUpSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Username
              </label>
              <div className="relative">
                <LucidIcon
                  name="User"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  id="username"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="signup-email"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <LucidIcon
                  name="Mail"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  id="signup-email"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="signup-password"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <LucidIcon
                  name="Lock"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  id="signup-password"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <LucidIcon
                  name="Lock"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  id="confirm-password"
                  className="w-full pl-10 pr-3 py-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg flex items-center justify-center"
            >
              <LucidIcon name="LogIn" className="w-6 h-6 mr-2" /> Sign Up
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default SignInPage;
