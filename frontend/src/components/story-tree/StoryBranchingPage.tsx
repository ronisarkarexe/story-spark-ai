import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import StoryTreePanel from "./StoryTreePanel";

/**
 * Standalone page for the Story Branching Visualizer.
 * Route: /story-tree/:rootStoryId
 *
 * Renders the lineage tree for a given root story identified by its ID.
 * Accessible via the "View Lineage Tree" button on each published story card.
 */
const StoryBranchingPage: React.FC = () => {
  const { rootStoryId } = useParams<{ rootStoryId: string }>();
  const navigate = useNavigate();

  if (!rootStoryId) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl text-slate-500">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-lg font-bold text-slate-200">No Story ID provided</h2>
          <p className="mt-2 text-sm text-slate-500">
            A valid root story ID is required to display the lineage tree.
          </p>
          <button
            onClick={() => navigate("/dashboard/published-stories")}
            className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition cursor-pointer"
          >
            Back to My Stories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Page Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition cursor-pointer"
              title="Go back"
              aria-label="Go back"
            >
              <i className="fas fa-arrow-left text-xs"></i>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                  Story Branching Visualizer
                </span>
              </div>
              <h1 className="text-lg font-black text-white leading-tight">
                AI Story Lineage Tree
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <i className="fas fa-info-circle text-indigo-400"></i>
            <span>Click any node to open that story version in the workspace</span>
          </div>
        </div>
      </div>

      {/* Visualizer Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* How-to legend */}
        <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-500"></span>
            Root Story
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full bg-indigo-500/80 border border-indigo-500"></span>
            Branch / Variation
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fas fa-mouse-pointer text-slate-400"></i>
            Click node to load
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fas fa-search-plus text-slate-400"></i>
            Scroll to zoom
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fas fa-arrows-alt text-slate-400"></i>
            Drag to pan
          </div>
        </div>

        <StoryTreePanel rootStoryId={rootStoryId} />
      </main>
    </div>
  );
};

export default StoryBranchingPage;
