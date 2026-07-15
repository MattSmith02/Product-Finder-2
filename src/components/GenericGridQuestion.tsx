import React, { useState } from "react";
import { Check, Ban, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Question, QuestionOption } from "../questions";

interface GenericGridQuestionProps {
  key?: any;
  question: Question;
  defaultValue?: any;
  onSelect: (value: any) => void;
  onBack?: () => void;
  currentStep: number;
  totalSteps: number;
}

const BRAND_PRESETS = [
  { value: "Apple", label: "Apple", style: "font-sans font-bold text-gray-900 text-sm tracking-tight" },
  { value: "Samsung", label: "SAMSUNG", style: "font-sans font-black text-blue-700 tracking-wider text-xs" },
  { value: "Sony", label: "SONY", style: "font-serif font-black tracking-widest text-xs text-gray-900" },
  { value: "ASUS", label: "ASUS", style: "font-sans italic font-black text-[#004ec4] tracking-widest text-xs" },
  { value: "Dell", label: "DELL", style: "font-sans font-bold border-2 border-sky-600 rounded-full w-10 h-10 flex items-center justify-center text-sky-600 text-[10px] tracking-tight mx-auto" },
  { value: "Lenovo", label: "Lenovo", style: "font-sans font-black bg-red-600 text-white px-2 py-0.5 text-[10px] tracking-tight" },
  { value: "LG", label: "LG", style: "font-sans font-bold text-pink-600 text-xs tracking-tight" },
  { value: "Google", label: "Google", style: "font-sans font-black bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent text-sm" },
  { value: "No preference", label: "No preference", style: "font-sans font-medium text-gray-400 text-xs" }
];

export default function GenericGridQuestion({
  question,
  defaultValue,
  onSelect,
  onBack,
  currentStep,
  totalSteps,
}: GenericGridQuestionProps) {
  // If single, state is string. If multi, state is string[].
  const isMulti = question.type === "multi" || question.type === "brands";
  const [selectedItems, setSelectedItems] = useState<any>(
    defaultValue || (isMulti ? [] : null)
  );

  const handleSelect = (val: string) => {
    if (isMulti) {
      if (question.type === "brands" && val === "No preference") {
        // Toggle No preference clears everything else
        if (selectedItems.includes("No preference")) {
          setSelectedItems([]);
        } else {
          setSelectedItems(["No preference"]);
        }
        return;
      }

      let nextItems = [...selectedItems];
      if (nextItems.includes("No preference")) {
        nextItems = nextItems.filter(x => x !== "No preference");
      }

      if (nextItems.includes(val)) {
        nextItems = nextItems.filter((x) => x !== val);
      } else {
        if (question.maxSelected && nextItems.length >= question.maxSelected) {
          // If we reached the max (e.g. choose up to 3), drop first or ignore. Let's drop first
          nextItems.shift();
        }
        nextItems.push(val);
      }
      setSelectedItems(nextItems);
    } else {
      setSelectedItems(val);
      // Auto-submit on single select option for a fast, responsive mobile feeling
      setTimeout(() => {
        onSelect(val);
      }, 250);
    }
  };

  const handleNext = () => {
    if (isMulti) {
      onSelect(selectedItems);
    } else if (selectedItems) {
      onSelect(selectedItems);
    }
  };

  // Render option contents
  const renderOptionContent = (opt: QuestionOption | { value: string; label: string; style?: string }) => {
    if (question.type === "brands") {
      const preset = BRAND_PRESETS.find(p => p.value === opt.value);
      if (opt.value === "No preference") {
        return (
          <div className="flex flex-col items-center justify-center space-y-2 py-3 w-full">
            <Ban className="w-5 h-5 text-gray-300" />
            <span className={preset?.style || "text-xs font-bold"}>{opt.label}</span>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center space-y-1 py-3 w-full text-center">
          <span className={preset?.style || "text-xs font-black"}>{opt.label}</span>
          <span className="text-[9px] font-bold text-gray-400 capitalize">{opt.value}</span>
        </div>
      );
    }

    // Standard Grid Question with Emoji
    const emoji = (opt as QuestionOption).emoji;
    return (
      <div className="flex flex-col items-center justify-center space-y-2 py-2 w-full text-center">
        {emoji && (
          <span className="text-3xl filter drop-shadow-sm select-none">
            {emoji}
          </span>
        )}
        <span className="text-xs font-extrabold text-gray-800 tracking-tight leading-tight pt-1">
          {opt.label}
        </span>
      </div>
    );
  };

  const optionsToRender = question.type === "brands" 
    ? BRAND_PRESETS 
    : (question.options || []);

  const isNextDisabled = isMulti 
    ? selectedItems.length === 0 
    : !selectedItems;

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-6 bg-white overflow-y-auto h-full">
      {/* Top Header Row */}
      <div>
        <div className="flex justify-between items-center mb-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-50 transition cursor-pointer flex items-center justify-center"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
          ) : (
            <div className="w-8" />
          )}
          <span className="text-xs font-mono font-bold text-gray-400">
            {currentStep} of {totalSteps}
          </span>
        </div>

        {/* ProgressBar */}
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="h-full transition-all duration-300"
            style={{ 
              width: `${(currentStep / totalSteps) * 100}%`,
              backgroundColor: "#1F69FF"
            }}
          />
        </div>

        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {question.subtitle}
          </p>
        )}
      </div>

      {/* Grid List */}
      <div className="my-auto py-5 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-3.5">
          {optionsToRender.map((opt) => {
            const isSelected = isMulti 
              ? selectedItems.includes(opt.value)
              : selectedItems === opt.value;

            return (
              <motion.button
                key={opt.value}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelect(opt.value)}
                className={`relative rounded-2xl border flex flex-col items-center justify-center p-3 transition-all duration-200 cursor-pointer h-28 ${
                  isSelected
                    ? "border-2 border-[#1F69FF] bg-[#E7F0FF] ring-1 ring-[#1F69FF]"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                {/* Check icon top right with customized vibrant color highlights */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#1F69FF] text-[#01FE9E] flex items-center justify-center p-0.5 shadow-sm">
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>
                )}

                {renderOptionContent(opt)}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer Button Block */}
      <div className="pt-2 shrink-0">
        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`w-full py-4 font-extrabold rounded-2xl shadow-md transition text-center text-sm ${
            isNextDisabled 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
              : "bg-[#1F69FF] hover:bg-blue-700 text-white cursor-pointer"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
