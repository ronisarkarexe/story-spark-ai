export interface ICleanupSummary {
  collectionName: string;
  orphanedRecordsFound: number;
  recordsPurged: number;
  executedAt: Date;
  success: boolean;
}