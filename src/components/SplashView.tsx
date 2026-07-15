import React from "react";
import { Award, Shield, CheckCircle, Smartphone, Laptop, Headphones, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface SplashViewProps {
  onStart: () => void;
  onPreviewCats: () => void;
}

export default function SplashView({ onStart, onPreviewCats }: SplashViewProps) {
  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-6 bg-white overflow-y-auto h-full">
      {/* Tom's Guide Header */}
      <div className="flex items-center gap-1 shrink-0 pt-1">
        <span className="text-[#004ec4] font-black text-2xl tracking-tighter uppercase font-sans">
          tom's guide
        </span>
      </div>

      {/* Hero Headings */}
      <div className="mt-4 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#004ec4] rounded-full text-[10px] font-extrabold tracking-widest uppercase mb-3">
          <Sparkles className="w-3 h-3 stroke-[2.5]" />
          Product Finder
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-[1.15]">
          Find the right tech.
          <span className="block text-[#004ec4]">Personalised for you.</span>
        </h1>
        <p className="text-sm text-gray-500 mt-2.5 max-w-sm leading-relaxed">
          Answer a few quick questions and we'll find the best products for your needs.
        </p>
      </div>

      {/* Main Technology Illustration Area */}
      <div className="my-6 flex-1 flex flex-col justify-center items-center relative min-h-[220px]">
        {/* Soft background glow */}
        <div className="absolute w-56 h-56 bg-blue-100/40 rounded-full blur-3xl -z-10" />

        {/* Dynamic, beautiful visual grouping */}
        <div className="relative w-full max-w-[280px] h-[190px] flex items-center justify-center">
          {/* Main Laptop Mock */}
          <motion.div
            initial={{ y: 0, rotate: -2 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-2 bottom-4 w-40 h-28 bg-[#1e293b] rounded-xl border-t border-slate-700 p-1 shadow-2xl flex flex-col justify-between"
          >
            <div className="flex-1 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 overflow-hidden relative p-1.5 flex flex-col justify-between">
              <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="text-[8px] text-white/80 font-mono">TG Labs v2.4</div>
            </div>
            {/* Keyboard base */}
            <div className="h-1 bg-slate-800 rounded-b" />
          </motion.div>

          {/* Overlapping Smartphone */}
          <motion.div
            initial={{ y: 0, rotate: 6 }}
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-12 bottom-2 w-14 h-28 bg-[#0b0f19] rounded-2xl border-2 border-slate-800 p-0.5 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex-1 rounded-[12px] bg-gradient-to-tr from-[#004ec4] via-blue-500 to-indigo-500 overflow-hidden relative p-1 flex flex-col justify-between">
              <div className="w-6 h-1.5 bg-black rounded-full mx-auto" />
              <div className="text-[6px] text-white/50 text-center">9:41</div>
            </div>
          </motion.div>

          {/* Elegant Studio Headphones */}
          <motion.div
            initial={{ y: 0, scale: 0.95, rotate: -8 }}
            animate={{ y: [2, -5, 2] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 top-2 w-28 h-28 flex items-center justify-center text-gray-300 drop-shadow-2xl"
          >
            <Headphones className="w-24 h-24 stroke-[1.25] text-slate-400" />
          </motion.div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-4 shrink-0">
        <button
          onClick={onStart}
          className="w-full py-4 bg-[#004ec4] hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer text-center text-sm tracking-wide"
        >
          Let's get started
        </button>

        <button
          onClick={onPreviewCats}
          className="w-full py-4 bg-[#E7F0FF] hover:bg-[#d8e7ff] text-[#1F69FF] font-extrabold rounded-2xl shadow-md transition-all duration-200 cursor-pointer text-center text-sm tracking-wide border border-blue-200 flex items-center justify-center gap-2"
        >
          <span>🧪 Preview Category Results</span>
        </button>

        <button
          onClick={onStart}
          className="w-full text-center text-xs text-gray-400 font-bold hover:text-gray-600 transition"
        >
          I know what I want
        </button>
      </div>

      {/* Editor Promise Trust Badges */}
      <div className="border-t border-gray-100 pt-5 mt-4 grid grid-cols-3 gap-1 shrink-0 text-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1.5">
            <Award className="w-4 h-4 text-[#004ec4]" />
          </div>
          <span className="text-[10px] font-black text-gray-800 leading-tight">Expert tested</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1.5">
            <CheckCircle className="w-4 h-4 text-[#004ec4]" />
          </div>
          <span className="text-[10px] font-black text-gray-800 leading-tight">Personal picks</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1.5">
            <Shield className="w-4 h-4 text-[#004ec4]" />
          </div>
          <span className="text-[10px] font-black text-gray-800 leading-tight">True confidence</span>
        </div>
      </div>
    </div>
  );
}
