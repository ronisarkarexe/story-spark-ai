import { ChildSafetyReport } from "../ai/ai.schemas";

export interface ISafetyAnalysisResult extends ChildSafetyReport {}

export interface ISafetyCheckOptions {
  checkSentenceLevel?: boolean;
  checkDiscourseLevel?: boolean;
}
