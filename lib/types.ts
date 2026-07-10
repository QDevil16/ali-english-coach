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
  | "speaking"
  | "sentence";

export interface PlacementQuestion {
  id: string;
  category: PlacementCategory;
  prompt: string;
  helpTr?: string;
  options: string[];
  answerIndex: number;
  audio?: boolean; // true ise cümle sesli okunur, metni gizlenir
  sentence?: string; // audio/speak için hedef cümle
  speak?: boolean; // true ise mikrofonla söyleme sorusu
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

export interface CurriculumWeek {
  week: number;
  goal: string;
  mainTopic: string;
  listeningGoal: string;
  speakingGoal: string;
  patterns: string[];
  reviewMistakes: string[];
  lessons: string[];
}

export interface CurriculumPlan {
  title: string;
  level: string;
  durationWeeks: number;
  weeks: CurriculumWeek[];
}

export interface LessonSection {
  type: string;
  title?: string;
  [key: string]: unknown;
}

export interface LessonContent {
  title: string;
  level: string;
  estimatedMinutes: number;
  focus: string[];
  sections: LessonSection[];
}

export interface EvaluationResult {
  correct: boolean;
  score: number;
  feedbackTr: string;
  correctAnswer?: string;
  mistakeCategory?: string;
}

export interface PlacementAnalysis {
  aiSummary: string;
  weakPoints: string[];
  strengths: string[];
  recommendation: string;
}
