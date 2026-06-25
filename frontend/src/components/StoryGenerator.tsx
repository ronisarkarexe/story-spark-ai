// frontend/src/components/StoryGenerator.tsx
import { useState, useRef } from 'react';
import api from '../services/api';

interface StoryGeneratorProps {
  onStoryGenerated?: (stories: any[]) => void;
}

export const StoryGenerator: React.FC<StoryGeneratorProps> = ({ onStoryGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [variationCount, setVariationCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setError('Story generation was cancelled.');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a story prompt.');
      return;
    }
    setError(null);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await api.post('/ai/generate', {
        prompt: prompt.trim(),
        variations: variationCount,
      }, {
        signal: controller.signal,
      });

      if (response?.data?.variations) {
        setStories(response.data.variations);
        if (onStoryGenerated) {
          onStoryGenerated(response.data.variations);
        }
      } else {
        throw new Error('No variations received from AI service');
      }
    } catch (error: any) {
      if (error.name === 'CanceledError' || error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        setError('Story generation was cancelled.');
        return;
      }
      console.error('AI Generation Error:', error);
      let errorMessage = 'Failed to generate stories. Please try again.';
      if (error.response?.status === 429) {
        errorMessage = 'The AI service is currently busy. Please wait a moment and try again.';
      } else if (error.response?.status === 504) {
        errorMessage = 'The AI service is taking too long. Please try again later.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Request timed out after 30 seconds. Please try again.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.';
      }
      setError(errorMessage);
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  return (
    <div className="story-generator max-w-3xl mx-auto p-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700">
            <i className="fas fa-exclamation-circle" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      )}

      {/* Prompt Input */}
      <div className="mb-4">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
          Story Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your story prompt..."
          disabled={isLoading}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
        />
      </div>

      {/* Variation Count */}
      <div className="mb-4">
        <label htmlFor="variations" className="block text-sm font-medium text-gray-700 mb-1">
          Number of Variations: {variationCount}
        </label>
        <input
          id="variations"
          type="range"
          min="1"
          max="5"
          value={variationCount}
          onChange={(e) => setVariationCount(Number(e.target.value))}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      {/* Generate / Cancel Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin" />
              Generating Stories...
            </>
          ) : (
            <>
              <i className="fas fa-wand-magic-sparkles" />
              Generate Stories
            </>
          )}
        </button>

        {isLoading && (
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            aria-label="Cancel story generation"
          >
            <i className="fas fa-times" />
            Cancel
          </button>
        )}
      </div>

      {/* Generated Stories */}
      {stories.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Generated Stories</h3>
          <div className="space-y-3">
            {stories.map((story, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-indigo-600">Variation {index + 1}</h4>
                <p className="text-gray-700 mt-1">{story}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryGenerator;
