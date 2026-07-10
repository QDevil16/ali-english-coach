export type CEFR = "A0" | "A1" | "A2" | "B1";

export type Skill =
  | "listening"
  | "speaking"
  | "grammar"
  | "vocabulary"
  | "reading"
  | "writing";

export interface LearnerProfileInput {
  goal: string;
  motivation: string;
  struggle_description: string;
  learning_style: string[];
  daily_minutes: number;
  priority_skills: string[];
}

export type PlacementCategory =
  | "vocabulary"
  | "grammar"
  | "reading"
  | "listening"
  | "sentence";

export interface PlacementQuestion {
  id: string;
  category: PlacementCategory;
  prompt: string;
  helpTr?: string;
  options: string[];
  answerIndex: number;
}

export interface PlacementResult {
  overall: CEFR;
  rawScore: number;
  total: number;
  skills: Record<string, CEFR>;
  weakPoints: string[];
  strengths: string[];
  recommendedStart: string;
}
