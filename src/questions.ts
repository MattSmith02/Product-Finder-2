import { 
  Laptop, Smartphone, Tv, Headphones, Watch, Camera, Home, Gamepad2,
  Tag, Zap, Battery, Monitor, Smile, ShieldCheck, Award,
  GraduationCap, Briefcase, Plane, Users, Palette, Activity,
  Feather, Leaf, VolumeX, Sparkles, Star, Shield, Settings, HelpCircle, Ban
} from "lucide-react";

export interface QuestionOption {
  value: string;
  label: string;
  icon?: any;
  emoji: string;
  desc?: string;
}

export interface Question {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  type: "single" | "multi" | "budget" | "brands";
  options?: QuestionOption[];
  maxSelected?: number;
}

export const SURVEY_QUESTIONS: Question[] = [
  {
    id: 1,
    key: "shoppingFor",
    title: "What are you shopping for?",
    subtitle: "Choose one",
    type: "single",
    options: [
      { value: "Laptops", label: "Laptops", emoji: "💻" },
      { value: "Phones", label: "Phones", emoji: "📱" },
      { value: "TVs", label: "TVs", emoji: "📺" },
      { value: "Headphones", label: "Headphones", emoji: "🎧" },
      { value: "Smartwatches", label: "Smartwatches", emoji: "⌚" },
      { value: "Cameras", label: "Cameras", emoji: "📷" },
      { value: "Smart home", label: "Smart home", emoji: "🏠" },
      { value: "Gaming", label: "Gaming", emoji: "🎮" }
    ]
  },
  {
    id: 2,
    key: "mostImportant",
    title: "What's most important?",
    subtitle: "Choose up to 3",
    type: "multi",
    maxSelected: 3,
    options: [
      { value: "Best value", label: "Best value", emoji: "🏷️" },
      { value: "Performance", label: "Performance", emoji: "⚡" },
      { value: "Battery life", label: "Battery life", emoji: "🔋" },
      { value: "Camera", label: "Camera", emoji: "📸" },
      { value: "Display", label: "Display", emoji: "🖥️" },
      { value: "Easy to use", label: "Easy to use", emoji: "😊" },
      { value: "Reliability", label: "Reliability", emoji: "🛡️" },
      { value: "Premium quality", label: "Premium quality", emoji: "💎" }
    ]
  },
  {
    id: 3,
    key: "budget",
    title: "What's your budget?",
    subtitle: "Move the slider",
    type: "budget"
  },
  {
    id: 4,
    key: "useCases",
    title: "How will you mainly use it?",
    subtitle: "Choose all that apply",
    type: "multi",
    options: [
      { value: "Student", label: "Student", emoji: "🎓" },
      { value: "Work", label: "Work", emoji: "💼" },
      { value: "Gaming", label: "Gaming", emoji: "🎮" },
      { value: "Travel", label: "Travel", emoji: "✈️" },
      { value: "Family", label: "Family", emoji: "👨‍👩‍👧" },
      { value: "Creative", label: "Creative", emoji: "🎨" },
      { value: "Everyday use", label: "Everyday use", emoji: "🏠" },
      { value: "Fitness", label: "Fitness", emoji: "💪" }
    ]
  },
  {
    id: 5,
    key: "brands",
    title: "Which brands do you like?",
    subtitle: "Choose all that apply",
    type: "brands"
  },
  {
    id: 6,
    key: "extra",
    title: "Anything else we should know?",
    subtitle: "Choose all that apply",
    type: "multi",
    options: [
      { value: "Lightweight", label: "Lightweight", emoji: "🪶" },
      { value: "Big screen", label: "Big screen", emoji: "🖥️" },
      { value: "Eco friendly", label: "Eco friendly", emoji: "🌱" },
      { value: "Quiet", label: "Quiet", emoji: "🤫" },
      { value: "Latest model", label: "Latest model", emoji: "✨" },
      { value: "Best reviewed", label: "Best reviewed", emoji: "⭐" },
      { value: "Long warranty", label: "Long warranty", emoji: "📜" },
      { value: "Easy setup", label: "Easy setup", emoji: "⚙" }
    ]
  }
];
