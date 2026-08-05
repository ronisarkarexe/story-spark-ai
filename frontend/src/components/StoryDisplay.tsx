import React, { useState, useMemo } from 'react';

// --- Sample Generated Stories (Mock Data for demonstration) ---
const MOCK_STORIES: string[] = [
  "The neon signs of Neo-Paris buzzed softly through the heavy downpour. Kaelen pulled his synth-leather jacket tighter around his shoulders, his eyes locked on the encrypted data drive humming in his palm. The corporate syndicate was hunting him now, and time was running out.",
  "Deep beneath the ocean's surface, the exploratory vessel Vanguard illuminated a sprawling reef of glowing cobalt crystals. Dr. Sarah Vance leaned closer to the viewing port, captivated by a rhythmic pulsing light from the trench below—it wasn't natural; it was a signal.",
  "A gentle breeze rolled over the emerald hills of Aveloria, carrying the sweet scent of sun-warmed lavender. Master Elion watched his young apprentice try to conjure a simple spark. With a sudden crackle, the spark erupted into a harmless but magnificent fireworks display."
];

export const StoryAnalyticsDashboard: React.FC = () => {
  const [storyContent, setStoryContent] = useState<string>(
    "Type your story here or click 'Generate New Story' below to see the statistics update instantly!"
  );

  // --- Acceptance Criteria Rule Logic ---
  // useMemo caches calculations, ensuring performance and instant updates
  const metrics = useMemo(() => {
    const trimmedText = storyContent.trim();

    // 1. Character count includes all visible text
    const characterCount = trimmedText.length;

    // 2. Word count safely splitting on arbitrary whitespaces/newlines
    const wordsArray = trimmedText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = wordsArray.length;

    // 3. Reading time calculated using the standard formula (words / 200)
    // Using Math.ceil so a 1-word story shows as '1 min' rather than 0
    const readingTime = wordCount > 0 ? Math.ceil(wordCount / 200) : 0;

    return {
      wordCount,
      characterCount,
      readingTime
    };
  }, [storyContent]);

  // Action: Generates/Simulates a newly fetched AI story
  const handleStoryGeneration = (): void => {
    const randomIndex = Math.floor(Math.random() * MOCK_STORIES.length);
    setStoryContent(MOCK_STORIES[randomIndex]);
  };

  return (
    <div className="analytics-container">
      {/* Scope-contained responsive styles injected cleanly via JSX */}
      <style>{`
        .analytics-container {
          max-width: 800px;
          width: 100%;
          margin: 2rem auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background-color: #111827;
          color: #f3f4f6;
          font-family: system-ui, -apple-system, sans-serif;
          border-radius: 12px;
          box-sizing: border-box;
        }
        .header-section h2 {
          margin: 0 0 0.25rem 0;
          font-size: 1.75rem;
          color: #ffffff;
        }
        .header-section p {
          margin: 0;
          color: #9ca3af;
          font-size: 0.95rem;
        }
        .story-editor {
          width: 100%;
          min-height: 180px;
          background-color: #1f2937;
          color: #f3f4f6;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 1rem;
          font-size: 1.05rem;
          line-height: 1.6;
          resize: vertical;
          box-sizing: border-box;
          font-family: inherit;
        }
        .story-editor:focus {
          outline: 2px solid #6366f1;
          border-color: transparent;
        }
        /* --- Clean & Minimal Statistics Panel UI --- */
        .stats-panel {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 1rem;
        }
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-right: 1px solid #374151;
        }
        .stat-card:last-child {
          border-right: none;
        }
        .stat-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
          margin-bottom: 0.25rem;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
        }
        .btn-generate {
          background-color: #6366f1;
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
          align-self: flex-start;
        }
        .btn-generate:hover {
          background-color: #4f46e5;
        }
        /* Responsive handling to prevent structural breakages */
        @media (max-width: 600px) {
          .stat-card {
            border-right: none;
            border-bottom: 1px solid #374151;
            padding-bottom: 0.75rem;
          }
          .stat-card:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      `}</style>

      <header className="header-section">
        <h2>Story Space</h2>
        <p>Your workspace analytics update automatically as new text displays.</p>
      </header>

      {/* Story Output / Input Box */}
      <textarea
        className="story-editor"
        value={storyContent}
        onChange={(e) => setStoryContent(e.target.value)}
        placeholder="Waiting for story content..."
      />

      {/* Action button to test story updates */}
      <button className="btn-generate" onClick={handleStoryGeneration}>
        Generate New Story
      </button>

      {/* Acceptance Criteria Met: Stats panel near the story output */}
      <section className="stats-panel" aria-label="Story Readability Statistics">
        <div className="stat-card">
          <span className="stat-label">Word Count</span>
          <span className="stat-value">{metrics.wordCount.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Character Count</span>
          <span className="stat-value">{metrics.characterCount.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Est. Reading Time</span>
          <span className="stat-value">
            {metrics.readingTime === 1 ? '1 min' : `${metrics.readingTime} mins`}
          </span>
        </div>
      </section>
    </div>
  );
};

export default StoryAnalyticsDashboard;