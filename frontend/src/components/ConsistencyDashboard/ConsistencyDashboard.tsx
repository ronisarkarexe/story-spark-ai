import React, { useState, useEffect, useCallback } from "react";
import "./ConsistencyDashboard.css";
import { IConsistencyReport } from "../../types/consistency.types";

interface ConsistencyDashboardProps {
  postId: string;
}

const ConsistencyDashboard: React.FC<ConsistencyDashboardProps> = ({ postId }) => {
  const [report, setReport] = useState<IConsistencyReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:5000/api/v1/consistency/report/${postId}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReport(data.data);
      } else {
        setError(data.message || "Failed to fetch report.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error fetching report";
      setError(errorMessage || "Error fetching report");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:5000/api/v1/consistency/analyze/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReport(data.data);
      } else {
        setError(data.message || "Failed to generate report.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error generating report";
      setError(errorMessage || "Error generating report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchReport();
    }
  }, [postId, fetchReport]);

  if (loading) {
    return <div className="consistency-dashboard loading">Analyzing Consistency...</div>;
  }

  if (error && !report) {
    return (
      <div className="consistency-dashboard error">
        <p>{error}</p>
        <button onClick={generateReport}>Run Consistency Check</button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="consistency-dashboard empty">
        <p>No consistency report available yet.</p>
        <button onClick={generateReport}>Run AI Consistency Guardian</button>
      </div>
    );
  }

  return (
    <div className="consistency-dashboard">
      <div className="dashboard-header">
        <h2>Story Consistency Guardian</h2>
        <div className={`score-badge ${report.score > 80 ? "high" : report.score > 50 ? "medium" : "low"}`}>
          Score: {report.score}/100
        </div>
        <button onClick={generateReport} className="refresh-btn">Re-Analyze</button>
      </div>

      {report.contradictions.length > 0 && (
        <div className="dashboard-section contradictions">
          <h3>Contradiction Alerts</h3>
          <ul>
            {report.contradictions.map((c, idx) => (
              <li key={idx} className="contradiction-item">
                <span className="type-badge">{c.type}</span>
                <p><strong>Issue:</strong> {c.description}</p>
                <p><strong>Fix Suggestion:</strong> {c.suggestedFix}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="dashboard-section characters">
        <h3>Character Evolution Tracker</h3>
        <div className="character-grid">
          {report.characters.map((char, idx) => (
            <div key={idx} className="character-card">
              <h4>{char.name}</h4>
              <p><strong>Traits:</strong> {char.traits.join(", ")}</p>
              <p><strong>Abilities:</strong> {char.abilities.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section timeline">
        <h3>Timeline Visualization</h3>
        <ul className="timeline-list">
          {report.timeline.map((event, idx) => (
            <li key={idx}>
              <strong>Ch {event.chapter}:</strong> {event.description} <em>({event.entitiesInvolved.join(", ")})</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConsistencyDashboard;
