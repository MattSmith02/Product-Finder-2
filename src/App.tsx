import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SURVEY_QUESTIONS } from "./questions";
import { TechAnswers } from "./types";

// Import Views
import SplashView from "./components/SplashView";
import BudgetQuestion from "./components/BudgetQuestion";
import GenericGridQuestion from "./components/GenericGridQuestion";
import ResultsView from "./components/ResultsView";

const INITIAL_ANSWERS: TechAnswers = {
  shoppingFor: "",
  mostImportant: [],
  budget: { min: 1000, max: 1500, segment: "£1,000 - £1,500" },
  useCases: [],
  brands: [],
  extra: []
};

export default function App() {
  const [view, setView] = useState<"splash" | "survey" | "results">("splash");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<TechAnswers>(INITIAL_ANSWERS);

  const totalSteps = SURVEY_QUESTIONS.length;

  const handleAnswer = (key: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setView("results");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      setView("splash");
    }
  };

  const handleRestart = () => {
    setAnswers(INITIAL_ANSWERS);
    setCurrentStep(1);
    setView("splash");
  };

  // Render the matching question slide component based on active step
  const renderSurveyQuestion = () => {
    const question = SURVEY_QUESTIONS[currentStep - 1];

    if (question.type === "budget") {
      return (
        <BudgetQuestion
          key={question.id}
          question={question}
          defaultValue={answers.budget}
          onSelect={(val) => handleAnswer("budget", val)}
          onBack={handleBack}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      );
    }

    return (
      <GenericGridQuestion
        key={question.id}
        question={question}
        defaultValue={(answers as any)[question.key]}
        onSelect={(val) => handleAnswer(question.key, val)}
        onBack={handleBack}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] sm:bg-[#e5e7eb] flex items-center justify-center p-0 sm:p-4 font-sans antialiased select-none">
      <div 
        id="desktop-frame"
        className="w-full max-w-[600px] h-screen sm:h-[840px] bg-white sm:rounded-[36px] sm:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.15)] sm:border sm:border-gray-100 overflow-hidden flex flex-col relative transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={view === "survey" ? `survey-step-${currentStep}` : view}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="flex-1 flex flex-col overflow-hidden h-full"
          >
            {view === "splash" && <SplashView onStart={() => setView("survey")} />}
            {view === "survey" && renderSurveyQuestion()}
            {view === "results" && <ResultsView answers={answers} onRestart={handleRestart} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
