import { useState } from "react";
import type { StoryboardScene } from "../../redux/apis/story.visualizer.api";

type StoryVisualizerProps = {
  scenes: StoryboardScene[];
  styleGuide: string;
  title?: string;
  onClose?: () => void;
};

type IllustrationPreviewProps = {
  scene: StoryboardScene;
};

const IllustrationPreview = ({ scene }: IllustrationPreviewProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage =
    Boolean(scene.imageUrl) &&
    scene.imageStatus !== "failed" &&
    !imageFailed;

  if (shouldShowImage) {
    return (
      <div className="aspect-[4/3] min-h-64 overflow-hidden rounded-2xl border border-indigo-300/20 bg-slate-950 shadow-inner">
        <img
          src={scene.imageUrl}
          alt={`Storyboard illustration for scene ${scene.sceneNumber}: ${scene.caption}`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  const message =
    scene.imageStatus === "failed" || imageFailed
      ? "Artwork could not be generated for this scene."
      : scene.imageStatus === "pending"
        ? "Artwork generation is still pending."
        : "AI-generated artwork will appear here when image generation is available.";

  return (
    <div className="flex aspect-[4/3] min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-indigo-300/20 bg-gradient-to-br from-slate-700 via-indigo-900/80 to-purple-950 p-6 text-center shadow-inner">
      <div className="max-w-sm rounded-2xl border border-white/10 bg-slate-950/30 px-6 py-7 backdrop-blur-sm">
        <div className="mb-3 text-4xl" aria-hidden="true">
          Image
        </div>
        <p className="text-lg font-bold text-slate-100">
          Illustration Preview
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {message}
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-indigo-200">
          This scene is ready for image generation.
        </p>
      </div>
    </div>
  );
};

const StoryVisualizer = ({
  scenes,
  styleGuide,
  title,
  onClose,
}: StoryVisualizerProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex flex-col gap-3 border-b border-slate-700/70 bg-slate-900/95 px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Storybook Visualizer
            </p>
            <h2 className="mt-1 text-3xl font-bold text-slate-100">
              Storyboard Mode
            </h2>
            {title && (
              <p className="mt-2 text-sm font-medium text-slate-400 break-words">
                {title}
              </p>
            )}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="self-start rounded-lg border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Close story visualizer"
            >
              Close
            </button>
          )}
        </div>

        <div className="overflow-y-auto px-5 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {scenes.map((scene) => (
              <article
                key={scene.sceneNumber}
                className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-800/80 shadow-xl shadow-slate-950/30"
              >
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="shrink-0 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-100 ring-1 ring-indigo-400/40">
                      Scene {scene.sceneNumber}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold leading-7 text-slate-100">
                    {scene.caption}
                  </h3>
                </div>

                <div className="px-5 pb-5">
                  <IllustrationPreview scene={scene} />

                  <details className="group mt-4 rounded-xl border border-slate-700/70 bg-slate-950/30">
                    <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:text-slate-100">
                      Show AI Prompt
                    </summary>
                    <div className="border-t border-slate-700/70 px-4 py-4">
                      <p className="break-words text-sm leading-6 text-slate-400">
                        {scene.imagePrompt}
                      </p>
                    </div>
                  </details>
                </div>
              </article>
            ))}
          </div>

          <details className="mt-6 rounded-xl border border-slate-700 bg-slate-800/60">
            <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:text-slate-100">
              View Style Guide
            </summary>
            <div className="border-t border-slate-700 px-4 py-4">
              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
                {styleGuide}
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default StoryVisualizer;
