import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, Building2, ArrowRight } from "lucide-react";
import { Employee } from "../types";

interface LoginScreenProps {
  onLogin: (employee: Employee) => void;
  employees: Employee[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, employees }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your Email or Employee ID");
      return;
    }

    const cleanedId = identifier.trim().toLowerCase();
    const found = employees.find(
      (emp) =>
        emp.id.toLowerCase() === cleanedId ||
        emp.email.toLowerCase() === cleanedId
    );

    if (found) {
      setError("");
      onLogin(found);
    } else {
      setError("No employee profile found with that ID or Email. Try 'EMP-1042', 'EMP-2023-084' or 'EMP-ADMIN'.");
    }
  };

  const handleQuickLogin = (emp: Employee) => {
    setIdentifier(emp.id);
    onLogin(emp);
  };

  return (
    <div id="login-container" className="min-h-screen flex flex-col justify-between items-center bg-radial from-slate-50 to-slate-200 py-10 px-4 select-none">
      {/* Top spacing */}
      <div />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl p-8 backdrop-blur-md relative transform transition-all hover:shadow-2xl">
        {/* Top Icon and Brand */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 mb-2">
            <Building2 className="w-8 h-8" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-indigo-600 uppercase font-sans">
            HR Connect
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 mt-2 text-center leading-relaxed">
            Please enter your credentials to access the system.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email or Employee ID Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Email or Employee ID
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
              <input
                id="login-id"
                type="text"
                placeholder="e.g. EMP-1042"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                onClick={() => alert("For testing use any of the quick login buttons below.")}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-sm transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="remember-me" className="ml-2.5 text-sm font-medium text-slate-600 cursor-pointer">
              Remember my device for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition-all hover:translate-y-[-1px] active:translate-y-[1px] cursor-pointer shadow-md shadow-indigo-100"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Logins Section */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <span className="block text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Quick Sandbox Access
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {employees.map((emp) => (
              <button
                key={emp.id}
                type="button"
                onClick={() => handleQuickLogin(emp)}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 hover:border-indigo-100 bg-slate-50/50 hover:bg-indigo-50/10 hover:text-indigo-700 transition-all text-left text-xs cursor-pointer group"
              >
                <img
                  src={emp.avatar}
                  alt={emp.name}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="truncate">
                  <p className="font-semibold text-slate-700 group-hover:text-indigo-900 leading-tight">
                    {emp.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{emp.role === "Admin" ? "HR Admin" : emp.id}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="text-center text-xs text-slate-400 space-y-1">
        <p>© 2026 HR Connect Management System.</p>
        <div className="flex justify-center gap-3 text-[11px] font-medium text-slate-400">
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-600 transition-colors">Help Center</a>
          <span>•</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-600 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};
