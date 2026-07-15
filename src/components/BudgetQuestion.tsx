import React, { useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Question } from "../questions";

interface BudgetQuestionProps {
  key?: any;
  question: Question;
  defaultValue?: { min: number; max: number; segment: string };
  onSelect: (value: { min: number; max: number; segment: string }) => void;
  onBack?: () => void;
  currentStep: number;
  totalSteps: number;
}

export default function BudgetQuestion({
  question,
  defaultValue = { min: 1000, max: 1500, segment: "£1,000 - £1,500" },
  onSelect,
  onBack,
  currentStep,
  totalSteps,
}: BudgetQuestionProps) {
  const [sliderVal, setSliderVal] = useState<number>(defaultValue.max);
  const [activePreset, setActivePreset] = useState<string>(defaultValue.segment);

  const presets = [
    { label: "Under £500", min: 200, max: 500 },
    { label: "£500 - £1,000", min: 500, max: 1000 },
    { label: "£1,000 - £1,500", min: 1000, max: 1500 },
    { label: "Premium (£1,500+)", min: 1500, max: 2500 }
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderVal(val);
    
    // Auto align preset if it falls close to ranges
    if (val <= 500) {
      setActivePreset("Under £500");
    } else if (val <= 1000) {
      setActivePreset("£500 - £1,000");
    } else if (val <= 1500) {
      setActivePreset("£1,000 - £1,500");
    } else {
      setActivePreset("Premium (£1,500+)");
    }
  };

  const handlePresetSelect = (preset: typeof presets[number]) => {
    setActivePreset(preset.label);
    setSliderVal(preset.max);
  };

  const handleNext = () => {
    const currentPreset = presets.find(p => p.label === activePreset) || presets[2];
    onSelect({
      min: currentPreset.min,
      max: currentPreset.max,
      segment: activePreset
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-6 bg-white overflow-y-auto h-full">
      {/* Top Progress Bar header */}
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
          <span className="text-xs font-mono font-normal text-gray-400">
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

        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {question.subtitle}
          </p>
        )}
      </div>

      {/* Main Budget Input Area */}
      <div className="my-auto py-6 space-y-8 flex-1 flex flex-col justify-center">
        {/* Large Centered Price Label */}
        <div className="text-center">
          <span className="text-3xl font-semibold text-[#1F69FF] tracking-tight font-display">
            {sliderVal <= 200 ? "£200" : sliderVal >= 2500 ? "£2,500+" : `£200 - £${sliderVal.toLocaleString()}`}
          </span>
        </div>

        {/* Custom Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="200"
            max="2500"
            step="100"
            value={sliderVal}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1F69FF]"
            style={{ accentColor: "#1F69FF" }}
          />
          <div className="flex justify-between text-[11px] font-mono font-normal text-gray-400">
            <span>£200</span>
            <span>£2,500+</span>
          </div>
        </div>

        {/* Range Label Divider */}
        <div className="space-y-4">
          <span className="block text-xs font-normal text-gray-400">
            or choose a range
          </span>

          {/* 2x2 Grid of Presets */}
          <div className="grid grid-cols-2 gap-3">
            {presets.map((preset) => {
              const isSelected = activePreset === preset.label;
              return (
                <motion.button
                  key={preset.label}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handlePresetSelect(preset)}
                  className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-[#1F69FF] bg-[#E7F0FF] text-[#1F69FF]"
                      : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                  }`}
                >
                  <span className="text-xs font-normal tracking-tight">
                    {preset.label}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#1F69FF] text-[#01FE9E] flex items-center justify-center p-0.5 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 shrink-0">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-[#1F69FF] hover:bg-blue-700 text-white font-normal rounded-2xl shadow-md transition cursor-pointer text-center text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}
