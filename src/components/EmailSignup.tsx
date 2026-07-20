import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

interface EmailSignupProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onBack: () => void;
}

export default function EmailSignup({ onSubmit, onBack }: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(email, password);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center gap-1 shrink-0 pt-6 px-6">
        <span className="text-[#004ec4] font-normal text-2xl tracking-tighter uppercase font-sans">
          tom's guide
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="max-w-sm mx-auto w-full"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#004ec4] rounded-full text-[10px] font-normal tracking-widest uppercase mb-4">
            <Sparkles className="w-3 h-3 stroke-[2.5]" />
            Almost there
          </div>

          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight leading-[1.15]">
            Get your <span className="text-[#004ec4]">personalised</span> results
          </h1>
          <p className="text-sm text-gray-500 mt-2.5 leading-relaxed">
            Create an account to unlock your shopping personality profile and save your matches for next time.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#004ec4] focus:bg-white transition"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                autoComplete="new-password"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#004ec4] focus:bg-white transition"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#004ec4] hover:bg-blue-700 text-white font-normal rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-center text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  Reveal my results <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <button
            onClick={onBack}
            className="w-full text-center text-xs text-gray-400 font-normal hover:text-gray-600 transition mt-4"
          >
            ← Back to questions
          </button>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-gray-400">
            <ShieldCheck className="w-3 h-3" />
            <span>We never share your email. No spam, ever.</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
