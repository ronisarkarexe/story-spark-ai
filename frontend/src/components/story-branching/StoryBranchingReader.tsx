import React, { useEffect, useState } from "react";
import { BranchingService, StorySegment, UserChoiceProgress } from "../../services/branching.service";
import "./StoryBranchingReader.css";

interface Props {
  storyId: string;
  onChoiceMade?: (choice: string) => void;
}

export const StoryBranchingReader: React.FC<Props> = ({ storyId, onChoiceMade }) => {
  const [currentSegment, setCurrentSegment] = useState<StorySegment | null>(null);
  const [userProgress, setUserProgress] = useState<UserChoiceProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial segment and user progress
  useEffect(() => {
    const loadStory = async () => {
      try {
        setLoading(true);
        const progress = await BranchingService.getUserProgress(storyId);
        if (progress) {
          setUserProgress(progress);
          // Load current segment from progress
        } else {
          // Load root segment (first time visitor)
          const tree = await BranchingService.getBranchTree(storyId, 1);
          if (tree.nodes.length > 0) {
            // Find root node
            const rootNode = tree.nodes.find((n: any) => !n.parentId);
            if (rootNode) {
              // Load root segment
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load story");
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [storyId]);

  const handleChoiceClick = async (choiceId: string, choiceText: string) => {
    if (!currentSegment) return;

    try {
      const progress = await BranchingService.recordUserChoice(
        storyId,
        currentSegment._id,
        choiceId,
        choiceText
      );

      setUserProgress(progress);
      onChoiceMade?.(choiceText);

      // Navigate to next segment
      const selectedChoice = currentSegment.choices.find((c) => c.id === choiceId);
      if (selectedChoice?.nextSegmentId) {
        // Load next segment
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process choice");
    }
  };

  if (loading) {
    return <div className="branching-reader-loading">Loading story...</div>;
  }

  if (error) {
    return <div className="branching-reader-error">Error: {error}</div>;
  }

  if (!currentSegment) {
    return <div className="branching-reader-empty">No story content found</div>;
  }

  return (
    <div className="story-branching-reader">
      <div className="segment-content">
        <p className="segment-text">{currentSegment.content}</p>

        <div className="choices-container">
          <h3 className="choices-title">What do you do?</h3>
          <div className="choices-list">
            {currentSegment.choices.map((choice) => (
              <button
                key={choice.id}
                className="choice-button"
                onClick={() => handleChoiceClick(choice.id, choice.text)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>

        {userProgress && (
          <div className="progress-info">
            <p>Choices made: {userProgress.choiceHistory.length}</p>
            {userProgress.completedAt && (
              <p>Story completed on {new Date(userProgress.completedAt).toLocaleDateString()}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryBranchingReader;
