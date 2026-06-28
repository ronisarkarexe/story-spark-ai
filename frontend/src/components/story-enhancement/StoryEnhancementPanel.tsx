import React, { useState } from 'react';
import { Sparkles, Copy, RotateCcw } from 'lucide-react';

type Style = 'formal' | 'casual' | 'poetic' | 'dark' | 'humorous';
type Tone = 'serious' | 'lighthearted' | 'dramatic' | 'mysterious' | 'inspiring';

interface EnhancementResult {
  success: boolean;
  original: string;
  enhanced: string;
  style: string;
  tone: string;
}

const STYLES: { value: Style; label: string; description: string }[] = [
  {
    value: 'formal',
    label: 'Formal',
    description: 'Professional and authoritative',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Friendly and conversational',
  },
  {
    value: 'poetic',
    label: 'Poetic',
    description: 'Lyrical and evocative',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Mysterious and ominous',
  },
  {
    value: 'humorous',
    label: 'Humorous',
    description: 'Witty and entertaining',
  },
];

const TONES: { value: Tone; label: string; description: string }[] = [
  {
    value: 'serious',
    label: 'Serious',
    description: 'Grave and thoughtful',
  },
  {
    value: 'lighthearted',
    label: 'Lighthearted',
    description: 'Fun and upbeat',
  },
  {
    value: 'dramatic',
    label: 'Dramatic',
    description: 'Intense and compelling',
  },
  {
    value: 'mysterious',
    label: 'Mysterious',
    description: 'Enigmatic and intriguing',
  },
  {
    value: 'inspiring',
    label: 'Inspiring',
    description: 'Motivational and uplifting',
  },
];

interface StoryEnhancementPanelProps {
  story: string;
  onEnhanced?: (result: EnhancementResult) => void;
}

export const StoryEnhancementPanel: React.FC<StoryEnhancementPanelProps> = ({
  story,
  onEnhanced,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<Style>('casual');
  const [selectedTone, setSelectedTone] = useState<Tone>('lighthearted');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEnhance = async () => {
    if (!story.trim()) {
      setError('Please provide a story to enhance');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/stories/enhance/full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story,
          style: selectedStyle,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance story');
      }

      const data: EnhancementResult = await response.json();
      setResult(data);
      onEnhanced?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Story Enhancement
        </h2>
      </div>

      {/* Style Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Select Style
        </label>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
          {STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => setSelectedStyle(style.value)}
              className={`rounded-lg border-2 p-3 text-left transition ${
                selectedStyle === style.value
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30'
                  : 'border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20'
              }`}
            >
              <div className="font-medium text-slate-900 dark:text-white">
                {style.label}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {style.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Select Tone
        </label>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
          {TONES.map((tone) => (
            <button
              key={tone.value}
              onClick={() => setSelectedTone(tone.value)}
              className={`rounded-lg border-2 p-3 text-left transition ${
                selectedTone === tone.value
                  ? 'border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-950/30'
                  : 'border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20'
              }`}
            >
              <div className="font-medium text-slate-900 dark:text-white">
                {tone.label}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {tone.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Enhance Button */}
      <button
        onClick={handleEnhance}
        disabled={isLoading || !story.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="h-4 w-4" />
        {isLoading ? 'Enhancing...' : 'Enhance Story'}
      </button>

      {/* Result Display */}
      {result && (
        <div className="space-y-4 rounded-lg bg-slate-50 p-4 dark:bg-white/5">
          <div>
            <h3 className="mb-2 flex items-center justify-between text-sm font-medium text-slate-900 dark:text-white">
              Enhanced Story ({result.style}, {result.tone})
              <button
                onClick={() => copyToClipboard(result.enhanced)}
                className="rounded p-1 hover:bg-slate-200 dark:hover:bg-white/10"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </button>
            </h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {result.enhanced}
            </p>
          </div>

          <button
            onClick={() => setResult(null)}
            className="flex items-center justify-center gap-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            <RotateCcw className="h-4 w-4" />
            Try Another Enhancement
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950/20 dark:text-blue-200">
        <p>
          <strong>Tip:</strong> Combine different styles and tones to create
          unique variations of your story. Experiment with all combinations!
        </p>
      </div>
    </div>
  );
};
