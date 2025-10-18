export interface Scenario {
  accidentType: string;
  locationType: string;
  description: string;
  image?: string; // Base64 encoded image data
  imageMimeType?: string; // e.g., 'image/jpeg'
}

export interface Intervention {
  suggestion: string;
  impactScore: number;
  costEstimate: string;
  rationale: string;
}

export interface Recommendations {
  bestLowCost: Intervention | null;
  bestHighImpact: Intervention | null;
}

export interface InterventionResult {
  shortTerm: Intervention[];
  longTerm: Intervention[];
  recommendations: Recommendations;
}