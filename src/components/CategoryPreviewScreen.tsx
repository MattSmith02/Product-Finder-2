import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import ResultsView from "./ResultsView";
import GenericGridQuestion from "./GenericGridQuestion";
import BudgetQuestion from "./BudgetQuestion";
import { SURVEY_QUESTIONS } from "../questions";
import { TechAnswers } from "../types";

interface CategoryPreviewScreenProps {
  onBack: () => void;
}

const CATEGORIES = [
  { name: "Laptops", emoji: "💻" },
  { name: "Phones", emoji: "📱" },
  { name: "TVs", emoji: "📺" },
  { name: "Headphones", emoji: "🎧" },
  { name: "Smartwatches", emoji: "⌚" },
  { name: "Cameras", emoji: "📷" },
  { name: "Smart home", emoji: "🏠" },
  { name: "Gaming", emoji: "🎮" }
];

// High-fidelity prefilled answers tailored for each category to show perfect realistic state
const DEFAULT_ANSWERS_BY_CAT: Record<string, TechAnswers> = {
  Laptops: {
    shoppingFor: "Laptops",
    mostImportant: ["Performance", "Premium quality", "Battery life"],
    budget: { min: 800, max: 1800, segment: "£800 - £1,800" },
    useCases: ["Work", "Student", "Creative"],
    brands: ["Apple", "Dell", "ASUS"],
    extra: ["Lightweight", "Latest model", "Best reviewed"]
  },
  Phones: {
    shoppingFor: "Phones",
    mostImportant: ["Camera", "Battery life", "Premium quality"],
    budget: { min: 500, max: 1200, segment: "£500 - £1,200" },
    useCases: ["Travel", "Everyday use", "Fitness"],
    brands: ["Apple", "Samsung", "Google"],
    extra: ["Lightweight", "Latest model", "Best reviewed"]
  },
  TVs: {
    shoppingFor: "TVs",
    mostImportant: ["Display", "Premium quality", "Best value"],
    budget: { min: 1000, max: 2000, segment: "£1,000 - £2,000" },
    useCases: ["Family", "Gaming"],
    brands: ["Sony", "LG", "Samsung"],
    extra: ["Big screen", "Best reviewed", "Easy setup"]
  },
  Headphones: {
    shoppingFor: "Headphones",
    mostImportant: ["Premium quality", "Battery life", "Best value"],
    budget: { min: 200, max: 400, segment: "£200 - £400" },
    useCases: ["Travel", "Fitness", "Work"],
    brands: ["Sony", "Apple", "No preference"],
    extra: ["Quiet", "Lightweight", "Best reviewed"]
  },
  Smartwatches: {
    shoppingFor: "Smartwatches",
    mostImportant: ["Battery life", "Easy to use", "Reliability"],
    budget: { min: 200, max: 500, segment: "£200 - £500" },
    useCases: ["Fitness", "Travel", "Everyday use"],
    brands: ["Apple", "Samsung", "Google"],
    extra: ["Lightweight", "Latest model", "Best reviewed"]
  },
  Cameras: {
    shoppingFor: "Cameras",
    mostImportant: ["Camera", "Performance", "Premium quality"],
    budget: { min: 1200, max: 2500, segment: "£1,200 - £2,500+" },
    useCases: ["Creative", "Travel", "Family"],
    brands: ["Sony", "No preference"],
    extra: ["Latest model", "Best reviewed", "Big screen"]
  },
  "Smart home": {
    shoppingFor: "Smart home",
    mostImportant: ["Easy to use", "Reliability", "Best value"],
    budget: { min: 200, max: 800, segment: "£200 - £800" },
    useCases: ["Family", "Everyday use"],
    brands: ["Google", "No preference"],
    extra: ["Easy setup", "Best reviewed", "Eco friendly"]
  },
  Gaming: {
    shoppingFor: "Gaming",
    mostImportant: ["Performance", "Display", "Premium quality"],
    budget: { min: 1000, max: 2500, segment: "£1,000 - £2,500+" },
    useCases: ["Gaming", "Creative", "Work"],
    brands: ["Sony", "ASUS", "No preference"],
    extra: ["Quiet", "Latest model", "Best reviewed"]
  }
};

const JOURNEY_STEPS = [
  { step: 1, label: "Category", emoji: "💻" },
  { step: 2, label: "Priority", emoji: "⚡" },
  { step: 3, label: "Budget", emoji: "💰" },
  { step: 4, label: "Usage", emoji: "🏠" },
  { step: 5, label: "Brands", emoji: "🏷️" },
  { step: 6, label: "Extras", emoji: "✨" },
  { step: 7, label: "Results", emoji: "🎉" }
];

export default function CategoryPreviewScreen({ onBack }: CategoryPreviewScreenProps) {
  const [selectedCat, setSelectedCat] = useState<string>("Laptops");
  const [activeStep, setActiveStep] = useState<number>(1);
  const [previewAnswers, setPreviewAnswers] = useState<TechAnswers>({ ...DEFAULT_ANSWERS_BY_CAT["Laptops"] });

  // Update preview answers when category changes
  useEffect(() => {
    const defaultAnswers = DEFAULT_ANSWERS_BY_CAT[selectedCat] || DEFAULT_ANSWERS_BY_CAT["Laptops"];
    setPreviewAnswers({ ...defaultAnswers });
  }, [selectedCat]);

  const handleUpdateAnswer = (key: string, value: any) => {
    setPreviewAnswers((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStepBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleStepNext = () => {
    if (activeStep < 7) {
      setActiveStep(activeStep + 1);
    }
  };

  // Render the corresponding survey question view inside our interactive showcase
  const renderActiveStepScreen = () => {
    if (activeStep === 7) {
      return (
        <div key={`results-${selectedCat}-${JSON.stringify(previewAnswers)}`} className="h-full">
          <ResultsView 
            answers={previewAnswers} 
            personality={null}
            onRestart={() => setActiveStep(1)} 
          />
        </div>
      );
    }

    const questionIndex = activeStep - 1;
    const question = SURVEY_QUESTIONS[questionIndex];

    if (!question) return null;

    if (question.type === "budget") {
      return (
        <div className="bg-white text-gray-900 h-full p-6 flex flex-col justify-between">
          <BudgetQuestion
            key={`budget-${selectedCat}`}
            question={question}
            defaultValue={previewAnswers.budget}
            onSelect={(val) => {
              handleUpdateAnswer("budget", val);
              handleStepNext();
            }}
            onBack={handleStepBack}
            currentStep={activeStep}
            totalSteps={6}
          />
        </div>
      );
    }

    const val = (previewAnswers as any)[question.key];

    return (
      <div className="bg-white text-gray-900 h-full p-6 flex flex-col justify-between">
        <GenericGridQuestion
          key={`grid-${question.key}-${selectedCat}`}
          question={question}
          defaultValue={val}
          onSelect={(selectedVal) => {
            handleUpdateAnswer(question.key, selectedVal);
            handleStepNext();
          }}
          onBack={handleStepBack}
          currentStep={activeStep}
          totalSteps={6}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0c1221] overflow-hidden h-full text-white">
      {/* Category & Stepper Preview Hub */}
      <div className="bg-[#131d35] border-b border-white/10 px-4 py-3 shrink-0 z-20 shadow-lg">
        {/* Top bar with Back button */}
        <div className="flex items-center justify-between mb-3.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-normal text-slate-300 hover:text-[#01FE9E] transition duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Exit Preview
          </button>
          <span className="text-[9px] uppercase font-normal tracking-widest text-[#01FE9E] bg-[#01FE9E]/10 px-2.5 py-1 rounded-full">
            Whole Journey Screen Auditor
          </span>
        </div>
        
        {/* Horizontal Category Tab Bar */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none snap-x -mx-4 px-4 border-b border-white/5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCat(cat.name);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-normal transition-all duration-200 shrink-0 snap-center cursor-pointer border ${
                  isSelected
                    ? "bg-[#1F69FF] text-white border-[#1F69FF] shadow-md shadow-[#1F69FF]/20"
                    : "bg-[#0c1221]/50 text-slate-300 border-white/5 hover:border-white/15"
                }`}
              >
                <span className="text-sm">{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Journey Stepper (Clickable Step Timeline) */}
        <div className="flex justify-between items-center gap-1.5 pt-3 overflow-x-auto scrollbar-none">
          {JOURNEY_STEPS.map((stepObj) => {
            const isCurrent = activeStep === stepObj.step;
            const isCompleted = activeStep > stepObj.step;
            return (
              <button
                key={stepObj.step}
                onClick={() => setActiveStep(stepObj.step)}
                className="flex flex-col items-center flex-1 min-w-[54px] cursor-pointer group"
              >
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 text-xs font-normal ${
                    isCurrent 
                      ? "bg-[#01FE9E] text-[#0c1221] scale-110 ring-4 ring-[#01FE9E]/20"
                      : isCompleted
                      ? "bg-[#1F69FF] text-white"
                      : "bg-[#0c1221] text-slate-400 border border-white/10 group-hover:border-slate-500"
                  }`}
                >
                  {stepObj.emoji}
                </div>
                <span 
                  className={`text-[8px] font-normal mt-1.5 tracking-tighter truncate max-w-[55px] text-center ${
                    isCurrent ? "text-[#01FE9E]" : "text-slate-400 group-hover:text-slate-300"
                  }`}
                >
                  {stepObj.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame Container for the Active Journey Screen */}
      <div className="flex-1 overflow-hidden relative bg-white">
        {renderActiveStepScreen()}
      </div>

      {/* Quick Nav bar at bottom of Category Previewer for rapid manual review */}
      <div className="bg-[#131d35] border-t border-white/10 px-4 py-3 shrink-0 flex items-center justify-between z-10">
        <button
          onClick={handleStepBack}
          disabled={activeStep === 1}
          className={`flex items-center gap-1 text-xs font-normal px-3 py-2 rounded-xl transition ${
            activeStep === 1 
              ? "text-slate-600 cursor-not-allowed" 
              : "text-slate-300 hover:text-white cursor-pointer hover:bg-white/5"
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Prev Screen
        </button>
        <span className="text-[10px] font-mono font-normal text-slate-400">
          Screen <strong className="text-white">{activeStep}</strong> of 7
        </span>
        <button
          onClick={handleStepNext}
          disabled={activeStep === 7}
          className={`flex items-center gap-1 text-xs font-normal px-3 py-2 rounded-xl transition ${
            activeStep === 7 
              ? "text-slate-600 cursor-not-allowed" 
              : "text-[#01FE9E] hover:text-[#01FE9E]/90 cursor-pointer hover:bg-white/5"
          }`}
        >
          Next Screen <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
