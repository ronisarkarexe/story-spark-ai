// frontend/src/components/StoryGenerator.tsx
import { useState, useRef } from 'react';
import api from '../services/api';

interface StoryGeneratorProps {
  onStoryGenerated?: (stories: any[]) => void;
}

const MIN_PROMPT_LENGTH = 10;
const MAX_PROMPT_LENGTH = 1000;

export const StoryGenerator: React.FC<StoryGeneratorProps> = ({ onStoryGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [variationCount, setVariationCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [stories, setStories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Derived values used both in JSX and inside handleGenerate
  const trimmedPrompt = prompt.trim();
  const promptLength = trimmedPrompt.length;
  const isPromptInvalid =
    promptLength < MIN_PROMPT_LENGTH || promptLength > MAX_PROMPT_LENGTH;

  const abortControllerRef = useRef<AbortController | null>(null);
  const handleGenerate = async () => {

    // trimmedPrompt and promptLength are already derived at component scope above
    if (!trimmedPrompt) {
      setError('Please enter a story prompt.');
      return;
    }

    if (promptLength < MIN_PROMPT_LENGTH) {
      setError(`Story prompt must be at least ${MIN_PROMPT_LENGTH} characters long.`);
      return;
    }

    if (promptLength > MAX_PROMPT_LENGTH) {
      setError(`Story prompt must be no more than ${MAX_PROMPT_LENGTH} characters long.`);
      return;
    }

    setError(null);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => {
      abortControllerRef.current?.abort();
      }, 15000);                                             //timeout after 15 seconds

    try {
      const response = await api.post('/ai/generate', {
        prompt: trimmedPrompt,
        variations: variationCount,
      }, {
        signal: abortControllerRef.current.signal,
      });
      clearTimeout(timeoutId);

      if (response?.data?.variations) {
        setStories(response.data.variations);
        if (onStoryGenerated) {
          onStoryGenerated(response.data.variations);
        }
      } else {
        throw new Error('No variations received from AI service');
      }
    } catch (error: any) {
      console.error('AI Generation Error:', error);

      let errorMessage = 'Failed to generate stories. Please try again.';

      if (error.response?.status === 429) {
        errorMessage = 'The AI service is currently busy. Please wait a moment and try again.';
      } else if (error.response?.status === 504) {
        errorMessage = 'The AI service is taking too long. Please try again later.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.name === 'AbortError' || error.code === 'ERR_CANCELED'){
        errorMessage = 'Request timed out. Please try again later.';
      } else if (!error.response) {
        errorMessage = 'Network error. Please check your connection.';
      }

      setError(errorMessage);
    } finally {
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

          {isLoading && (
          <button
            onClick = {() => abortControllerRef.current?.abort()}
            className = "w-full px-6 py-3 mt-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cancel
          </button> 
        )}
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
          minLength={MIN_PROMPT_LENGTH}
          maxLength={MAX_PROMPT_LENGTH}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
        />

        <div className="mt-1 flex justify-between text-sm">
          <span
            className={
              promptLength > 0 && promptLength < MIN_PROMPT_LENGTH
                ? 'text-red-600'
                : 'text-gray-500'
            }
          >
            Minimum {MIN_PROMPT_LENGTH} characters required
          </span>

          <span
            className={
              promptLength > MAX_PROMPT_LENGTH
                ? 'text-red-600'
                : 'text-gray-500'
            }
          >
            {promptLength}/{MAX_PROMPT_LENGTH}
          </span>
        </div>
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

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading || isPromptInvalid}
        className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
