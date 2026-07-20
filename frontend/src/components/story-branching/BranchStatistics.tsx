import React, { useEffect, useState } from "react";
import { BranchingService, BranchStatistics } from "../../services/branching.service";
import "./BranchStatistics.css";

interface StatisticsSummary {
  totalSegments: number;
  totalChoices: number;
  totalSelections: number;
  mostPopularChoices: BranchStatistics[];
  avgSegmentsPerPath: string;
}

interface Props {
  storyId: string;
}

export const BranchStatistics: React.FC<Props> = ({ storyId }) => {
  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        const stats = await BranchingService.getStatisticsSummary(storyId);
        setSummary(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [storyId]);

  if (loading) {
    return <div className="statistics-loading">Loading statistics...</div>;
  }

  if (error) {
    return <div className="statistics-error">Error: {error}</div>;
  }

  if (!summary) {
    return <div className="statistics-empty">No statistics available</div>;
  }

  return (
    <div className="branch-statistics-container">
      <h2>Story Branch Statistics</h2>

      <div className="statistics-grid">
        <div className="stat-card">
          <h3>Total Segments</h3>
          <p className="stat-value">{summary.totalSegments}</p>
        </div>

        <div className="stat-card">
          <h3>Total Choices</h3>
          <p className="stat-value">{summary.totalChoices}</p>
        </div>

        <div className="stat-card">
          <h3>Total Selections</h3>
          <p className="stat-value">{summary.totalSelections}</p>
        </div>

        <div className="stat-card">
          <h3>Avg Path Length</h3>
          <p className="stat-value">{summary.avgSegmentsPerPath} segments</p>
        </div>
      </div>

      <div className="most-popular-choices">
        <h3>Most Popular Choices</h3>
        <div className="choices-list">
          {summary.mostPopularChoices.map((choice, index) => (
            <div key={`${choice.segmentId}-${choice.choiceId}`} className="choice-stat">
              <span className="rank">#{index + 1}</span>
              <span className="count">{choice.totalSelections} selections</span>
              <span className="percentage">
                ({Number(choice.percentageSelected).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchStatistics;
