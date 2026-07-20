import { TechAnswers } from "../types";

export interface PersonalityProfile {
  type: string;
  emoji: string;
  tagline: string;
  description: string;
  traits: string[];
}

export function derivePersonality(answers: TechAnswers): PersonalityProfile {
  const important = answers.mostImportant || [];
  const useCases = answers.useCases || [];
  const extra = answers.extra || [];
  const budget = answers.budget || { min: 0, max: 0 };
  const budgetMax = budget.max || 0;

  // Score each personality archetype
  const scores: Record<string, number> = {
    "The Value Hunter": 0,
    "The Power User": 0,
    "The Aesthete": 0,
    "The Pragmatist": 0,
    "The Early Adopter": 0,
  };

  if (important.includes("Best value")) scores["The Value Hunter"] += 3;
  if (important.includes("Performance")) scores["The Power User"] += 3;
  if (important.includes("Premium quality")) scores["The Aesthete"] += 3;
  if (important.includes("Reliability")) scores["The Pragmatist"] += 3;
  if (important.includes("Easy to use")) scores["The Pragmatist"] += 2;
  if (important.includes("Battery life")) scores["The Pragmatist"] += 1;
  if (important.includes("Display")) scores["The Aesthete"] += 2;
  if (important.includes("Camera")) scores["The Aesthete"] += 1;

  if (extra.includes("Latest model")) scores["The Early Adopter"] += 3;
  if (extra.includes("Best reviewed")) scores["The Pragmatist"] += 2;
  if (extra.includes("Eco friendly")) scores["The Value Hunter"] += 1;
  if (extra.includes("Long warranty")) scores["The Pragmatist"] += 2;
  if (extra.includes("Lightweight")) scores["The Aesthete"] += 1;

  if (useCases.includes("Gaming")) scores["The Power User"] += 2;
  if (useCases.includes("Creative")) scores["The Aesthete"] += 2;
  if (useCases.includes("Work")) scores["The Pragmatist"] += 1;
  if (useCases.includes("Student")) scores["The Value Hunter"] += 2;
  if (useCases.includes("Travel")) scores["The Early Adopter"] += 1;

  if (budgetMax <= 800) scores["The Value Hunter"] += 2;
  if (budgetMax >= 2000) scores["The Aesthete"] += 2;
  if (budgetMax >= 2000) scores["The Power User"] += 1;

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topType = sorted[0][0];

  const profiles: Record<string, PersonalityProfile> = {
    "The Value Hunter": {
      type: "The Value Hunter",
      emoji: "🏷️",
      tagline: "Maximum bang for your buck",
      description:
        "You hunt for the best deals without compromising on quality. You know that smart spending beats impulse buying every time.",
      traits: ["Deal-savvy", "Research-driven", "Practical spender"],
    },
    "The Power User": {
      type: "The Power User",
      emoji: "⚡",
      tagline: "Performance above all",
      description:
        "You want raw power and capability. Specs matter, benchmarks matter, and you push your tech to its limits.",
      traits: ["Spec-focused", "Performance-first", "Enthusiast"],
    },
    "The Aesthete": {
      type: "The Aesthete",
      emoji: "💎",
      tagline: "Form meets function",
      description:
        "You appreciate beautiful design and premium build quality. Your tech should look as good as it performs.",
      traits: ["Design-led", "Quality-obsessed", "Tasteful"],
    },
    "The Pragmatist": {
      type: "The Pragmatist",
      emoji: "🛡️",
      tagline: "Reliable, sensible, proven",
      description:
        "You value reliability and longevity over flash. You buy tech that just works and lasts for years.",
      traits: ["Reliability-focused", "Long-term thinker", "No-nonsense"],
    },
    "The Early Adopter": {
      type: "The Early Adopter",
      emoji: "✨",
      tagline: "First to the future",
      description:
        "You love the cutting edge. Newest models, latest features, and tomorrow's tech today — that's your playground.",
      traits: ["Trend-setter", "Feature-curious", "Forward-looking"],
    },
  };

  return profiles[topType];
}
