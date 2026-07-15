export interface TechAnswers {
  shoppingFor: string;
  mostImportant: string[];
  budget: {
    min: number;
    max: number;
    segment: string;
  };
  useCases: string[];
  brands: string[];
  extra: string[];
}

export interface ProductRecommendation {
  id: string;
  name: string;
  brand: string;
  category: string;
  rating: number;
  reviewsCount: number;
  price: string;
  matchScore: number;
  tag: string; // e.g. "BEST MATCH", "GREAT VALUE", "PREMIUM PICK"
  specs: string[];
  description: string;
  pros: string[];
  cons: string[];
  imageUrl: string;
}

export interface TechProfile {
  tags: string[];
  summary: string;
}
