import React, { useState, useEffect } from "react";
import { 
  Star, Check, RefreshCw, ChevronRight, Home, Search, Compass, 
  Tag, Heart, ShoppingCart, Info, Award, CheckCircle, Shield, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TechAnswers, ProductRecommendation } from "../types";

interface ResultsViewProps {
  answers: TechAnswers;
  onRestart: () => void;
}

const LOADING_PHASES = [
  "Evaluating your tech lifestyle profile...",
  "Cross-referencing Tom's Guide expert review scores...",
  "Filtering out brands...",
  "Analyzing specs for your budget tier...",
  "Assembling your custom top 3 product matches..."
];

export default function ResultsView({ answers, onRestart }: ResultsViewProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [products, setProducts] = useState<ProductRecommendation[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductRecommendation | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAllResults, setShowAllResults] = useState<boolean>(false);

  // Fetch recommendations from API
  useEffect(() => {
    let active = true;
    setLoading(true);
    setPhaseIndex(0);

    async function fetchRecommendations() {
      try {
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ answers })
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }

        const data = await response.json();
        if (active) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("API error, using local fallback:", err);
      } finally {
        if (active) {
          setTimeout(() => {
            setLoading(false);
          }, 2800);
        }
      }
    }

    fetchRecommendations();

    return () => {
      active = false;
    };
  }, [answers]);

  // Handle loading phase transitions
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev < LOADING_PHASES.length - 1 ? prev + 1 : prev));
    }, 550);
    return () => clearInterval(interval);
  }, [loading]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(x => x !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0b0f19] px-8 text-white text-center h-full">
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-white/5" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-t-[#004ec4] border-r-cyan-400 border-b-transparent border-l-transparent"
          />
          <Award className="w-8 h-8 text-blue-400" />
        </div>

        <h2 className="text-xl font-extrabold tracking-tight font-display">
          Assembling Tech Recommendations
        </h2>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={phaseIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs font-mono text-gray-400 mt-3 max-w-xs"
          >
            {LOADING_PHASES[phaseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  }

  // Generate dynamic selected tags list for the dark header panel
  const selectedTags: string[] = [];
  if (answers.shoppingFor) selectedTags.push(answers.shoppingFor);
  if (answers.budget?.segment) selectedTags.push(answers.budget.segment);
  if (answers.mostImportant && answers.mostImportant[0]) selectedTags.push(answers.mostImportant[0]);
  if (answers.useCases && answers.useCases[0]) selectedTags.push(answers.useCases[0]);

  // Default display values
  const totalFoundCount = 24;

  return (
    <div className="flex-1 flex flex-col bg-[#0c1221] overflow-hidden h-full text-white relative">
      {/* Top sticky brand line designed to blend elegantly with the immersive full-screen celebration background */}
      <div className="bg-[#0c1221]/80 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex justify-between items-center shrink-0 z-10">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E7F0FF] to-[#01FE9E] font-black text-lg tracking-tighter uppercase font-sans">
          tom's guide
        </span>
        <button
          onClick={onRestart}
          className="text-xs font-bold text-slate-300 hover:text-[#01FE9E] flex items-center gap-1.5 transition duration-200 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 stroke-[2]" /> Restart
        </button>
      </div>

      {/* Main Results Feed Scroll Area with immersive celebration elements */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-8">
        {/* Immersive full-screen celebration hero header */}
        <div className="relative bg-[#131d35] border border-white/5 rounded-3xl p-8 text-center text-white overflow-hidden shadow-2xl">
          {/* Enhanced bright, festive particles in the background */}
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="absolute top-4 left-6 w-2 h-2 rounded bg-rose-400 rotate-12 animate-pulse" />
            <div className="absolute top-12 right-12 w-3 h-1.5 bg-yellow-400 rotate-45 animate-bounce" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-6 left-16 w-2.5 h-3 bg-cyan-400 -rotate-12" />
            <div className="absolute bottom-12 right-24 w-2 h-2 rounded bg-[#01FE9E] rotate-6 animate-ping" style={{ animationDuration: "3s" }} />
            <div className="absolute top-1/2 left-4 w-3 h-1 bg-pink-400 rotate-90" />
            <div className="absolute top-1/3 right-6 w-2 h-2 rounded bg-purple-400 rotate-45" />
          </div>

          {/* Celebratory Checkmark circle with custom accent glow */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-[#10b981] border-4 border-[#01FE9E]/30 flex items-center justify-center shadow-[0_0_20px_rgba(1,254,158,0.2)] relative">
              <Check className="w-7 h-7 stroke-[4] text-white" />
              <span className="absolute -top-1.5 -right-2.5 text-xl animate-bounce">🎉</span>
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#01FE9E]">
            Perfect Match Found!
          </h1>
          <p className="text-xs text-slate-300 mt-2 max-w-[290px] mx-auto leading-relaxed">
            We've discovered <strong className="text-[#01FE9E] font-black">{totalFoundCount} devices</strong> matching your exact specifications. Here are our top 3 hand-picked options.
          </p>

          {/* Dynamic matching criteria tag pills */}
          <div className="flex flex-wrap gap-1.5 justify-center mt-5">
            {selectedTags.map((tag) => (
              <span 
                key={tag} 
                className="bg-[#1F69FF] text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Product Cards with high contrast details, looking incredibly distinct */}
        <div className="grid grid-cols-3 gap-3.5">
          {products.map((prod) => {
            const isFav = favorites.includes(prod.id);
            // Dynamic premium pick indicators
            let tagColorClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            if (prod.tag === "GREAT VALUE") tagColorClass = "text-blue-400 bg-blue-500/10 border-blue-500/20";
            if (prod.tag === "PREMIUM PICK") tagColorClass = "text-purple-400 bg-purple-500/10 border-purple-500/20";

            return (
              <motion.div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white rounded-2xl overflow-hidden flex flex-col justify-between p-3.5 cursor-pointer relative shadow-xl border border-white/5"
              >
                {/* Badge top */}
                <div className={`text-[8px] font-black tracking-wider uppercase text-center py-1 px-1.5 rounded-lg border mb-2 truncate shrink-0 overflow-hidden leading-none max-w-full block font-mono ${tagColorClass}`}>
                  <span>{prod.tag}</span>
                </div>

                {/* Main Centered Product Image */}
                <div className="relative w-full aspect-square bg-slate-50/50 rounded-xl overflow-hidden mb-3 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                  {/* Heart button */}
                  <button
                    onClick={(e) => toggleFavorite(prod.id, e)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 hover:bg-white shadow-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>

                {/* Details Section */}
                <div className="flex-1 flex flex-col justify-between text-gray-900">
                  <div>
                    <h3 className="text-xs font-black text-gray-900 tracking-tight leading-snug line-clamp-2 h-8">
                      {prod.name}
                    </h3>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-1 mb-2 font-bold">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                      <span className="text-gray-800">{prod.rating}</span>
                      <span className="text-gray-400">({prod.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Pricing footer */}
                  <div className="border-t border-gray-100 pt-2 shrink-0">
                    <div className="text-sm font-black text-[#1F69FF] font-mono leading-none">
                      {prod.price}
                    </div>
                    <div className="text-[8px] text-emerald-600 font-extrabold flex items-center gap-0.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Lowest price today
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View all Results Button Strip styled to match the dark celebration view */}
        <div className="pt-2">
          <button
            onClick={() => {
              setShowAllResults(!showAllResults);
            }}
            className="w-full bg-[#131d35] border border-white/5 p-4 rounded-2xl shadow-lg hover:bg-[#1b2746] transition flex items-center justify-between cursor-pointer text-white"
          >
            <span className="text-xs font-black text-slate-100">
              View all {totalFoundCount} results
            </span>
            <ChevronRight className="w-4 h-4 text-[#01FE9E]" />
          </button>
        </div>

        {/* Extra results list toggle */}
        <AnimatePresence>
          {showAllResults && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden pt-1"
            >
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-xs text-slate-300 leading-relaxed text-center">
                Our active editorial board tracked {totalFoundCount} devices matching your criteria. Explore other expert tested alternatives below!
              </div>

              {/* Curated list */}
              {[
                { name: "Alternative Model S (2024)", price: "£629.00", rating: 4.6 },
                { name: "Budget Champion Pro V3", price: "£349.00", rating: 4.5 }
              ].map((alt, aIdx) => (
                <div key={aIdx} className="bg-[#131d35] p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{alt.name}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span className="text-slate-300">{alt.rating} editor score</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-[#01FE9E] font-mono">{alt.price}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Editor Details modal (renders detailed analysis, pros, cons when clicking any card) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="absolute inset-0 bg-black/80 z-30 flex items-end justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full bg-[#0c1221] border-t sm:border border-white/10 rounded-t-[32px] sm:rounded-3xl p-6 space-y-5 max-h-[85%] overflow-y-auto shadow-2xl relative text-white"
            >
              {/* Drag line */}
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto -mt-2 mb-2" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-5 text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>

              {/* Header Info */}
              <div>
                <span className="text-[10px] bg-[#1F69FF] text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono border border-white/5">
                  {selectedProduct.tag}
                </span>
                <h2 className="text-xl font-black text-white mt-2 tracking-tight leading-snug">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-400 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                    <span className="font-bold text-slate-200">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-xs text-slate-400">({selectedProduct.reviewsCount} verified reviews)</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2">
                <span className="text-[9px] font-black text-[#01FE9E] tracking-wider uppercase block">
                  Expert Tested Specifications
                </span>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {selectedProduct.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="text-xs text-slate-200 flex items-start gap-1.5 font-medium">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                  Editorial Snippet
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl space-y-2">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block font-mono">
                    Pros
                  </span>
                  {selectedProduct.pros.map((pro, pIdx) => (
                    <div key={pIdx} className="text-[11px] text-slate-200 leading-tight">
                      • {pro}
                    </div>
                  ))}
                </div>

                <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl space-y-2">
                  <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block font-mono">
                    Cons
                  </span>
                  {selectedProduct.cons.map((con, cIdx) => (
                    <div key={cIdx} className="text-[11px] text-slate-200 leading-tight">
                      • {con}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deal CTA Button with updated theme colors */}
              <div className="pt-2">
                <a
                  href="https://www.tomsguide.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#1F69FF] hover:bg-blue-600 text-white font-extrabold rounded-2xl text-center shadow-lg transition duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>View active deal ({selectedProduct.price})</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
