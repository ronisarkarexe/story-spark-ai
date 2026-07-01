import mongoose from 'mongoose';
import { ICleanupSummary } from '../types/janitor';

export class DatabaseJanitorService {
  /**
   * Scans a target auxiliary collection and removes any documents whose 
   * parent reference ID no longer exists in the primary collection.
   * 
   * @param primaryModel The Mongoose model that should contain the parent record (e.g., Story)
   * @param auxiliaryModel The Mongoose model tracking child data (e.g., Chapter)
   * @param foreignKeyRef The field name in the auxiliary model holding the parent ID (e.g., 'storyId')
   */
  public static async purgeOrphanedDocuments(
    primaryModel: mongoose.Model<any>,
    auxiliaryModel: mongoose.Model<any>,
    foreignKeyRef: string
  ): Promise<ICleanupSummary> {
    const summary: ICleanupSummary = {
      collectionName: auxiliaryModel.collection.name,
      orphanedRecordsFound: 0,
      recordsPurged: 0,
      executedAt: new Date(),
      success: false
    };

    try {
      // 1. Fetch all unique parent IDs currently referenced in the child collection
      const distinctRefs = await auxiliaryModel.distinct(foreignKeyRef);
      const orphanedIds: mongoose.Types.ObjectId[] = [];

      // 2. Validate existence of each parent record
      for (const refId of distinctRefs) {
        if (!refId) continue;
        
        const parentExists = await primaryModel.exists({ _id: refId });
        if (!parentExists) {
          orphanedIds.push(refId);
        }
      }

      summary.orphanedRecordsFound = orphanedIds.length;

      // 3. Clean up the orphaned sub-documents if discrepancies are detected
      if (orphanedIds.length > 0) {
        const deletionResult = await auxiliaryModel.deleteMany({
          [foreignKeyRef]: { $in: orphanedIds }
        });
        summary.recordsPurged = deletionResult.deletedCount || 0;
      }

      summary.success = true;
    } catch (error) {
      console.error(`[Janitor Error] Failed cleaning ${auxiliaryModel.collection.name}:`, error);
      summary.success = false;
    }

    return summary;
  }
}