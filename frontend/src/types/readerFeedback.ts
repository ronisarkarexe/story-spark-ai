export interface ReaderFeedback {
  id: number;
  persona: string;
  engagement: number;
  pacing: number;
  clarity: number;
  emotion: number;
  overall: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}
