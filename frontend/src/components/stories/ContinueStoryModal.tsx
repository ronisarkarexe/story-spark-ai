import { useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import AuthContext from "../auth.context";
import {
  useContinueStoryMutation,
  useContinueFreeStoryMutation,
} from "../../redux/apis/ai.model.api";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ContinueStoryModalProps {
  /** The original story the user wants to continue */
  story: {
    title: string;
    content: string;
    language?: string;
  };
  /** Called when the modal is dismissed */
  onClose: () => void;
  /** Called when the continued story is applied */
  onApply: (continuedContent: string) => void;
}

interface BranchNode {
  id: string;
  parentId: string | null;
  parentContent: string;
  continuation: string;
  depth: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const buildSeedPrompt = (content: string): string =>
  `${content.trim()}\n\n---\nContinue this story from where it left off:`;

// ─── Component ──────────────────────────────────────────────────────────────

const ContinueStoryModal = ({ story, onClose, onApply }: ContinueStoryModalProps) => {
  const auth = useContext(AuthContext);
  const isAuthenticated = !!auth?.accessToken;

  const [continueStory, { isLoading: isAuthLoading }] =
    useContinueStoryMutation();
  const [continueFreeStory, { isLoading: isFreeLoading }] =
    useContinueFreeStoryMutation();

  const isLoading = isAuthLoading || isFreeLoading;

  // The current prompt shown in the textarea (starts pre-seeded with story content)
  const [prompt, setPrompt] = useState(story.content);

  // Completed branch nodes shown in the tree
  const [branches, setBranches] = useState<BranchNode[]>([]);

  // The currently selected branch (for drilling down further)
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

  const activeBranch = branches.find((b) => b.id === activeBranchId) ?? null;

  const getFullContent = (branchId: string | null): string => {
    if (!branchId) return story.content;
    const path: BranchNode[] = [];
    let currId: string | null = branchId;
    while (currId) {
      const node = branches.find((b) => b.id === currId);
      if (!node) break;
      path.unshift(node);
      currId = node.parentId;
    }
    const continuations = path.map((node) => node.continuation.trim()).join("\n\n");
    return `${story.content.trim()}\n\n${continuations}`;
  };

  const handleGenerate = async () => {
    const seedPrompt = buildSeedPrompt(prompt);

    try {
      let result: { data: { continuation: string }; message: string };

      if (isAuthenticated) {
        result = await continueStory({
          prompt: seedPrompt,
          language: story.language ?? "English",
        }).unwrap();
      } else {
        result = await continueFreeStory({
          prompt: seedPrompt,
          language: story.language ?? "English",
        }).unwrap();
      }

      const continuation = result.data.continuation;
      const newBranch: BranchNode = {
        id: `branch-${Date.now()}`,
        parentId: activeBranchId,
        parentContent: prompt,
        continuation,
        depth: activeBranch ? activeBranch.depth + 1 : 0,
      };

      setBranches((prev) => [...prev, newBranch]);
      setActiveBranchId(newBranch.id);
      toast.success("Continuation generated!");
    } catch {
      toast.error("Failed to generate continuation. Please try again.");
    }
  };

  const handleExtendBranch = (branch: BranchNode) => {
    setActiveBranchId(branch.id);
    setPrompt(branch.continuation);
  };

  const handleApply = () => {
    const fullStory = getFullContent(activeBranchId);
    onApply(fullStory);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        key="continue-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          key="continue-modal-panel"
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/60"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 rounded-t-3xl border-b border-white/10 bg-slate-900/90 p-5 backdrop-blur-xl">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">
                Story Continuation
              </p>
              <h2 className="mt-0.5 text-lg font-extrabold text-white truncate max-w-sm">
                {story.title}
              </h2>
            </div>
            <button
              type="button"
              id="continue-story-modal-close"
              aria-label="Close modal"
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* ── Branching Tree ──────────────────────────────────────────── */}
            {branches.length > 0 && (
              <section>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                  Branching Tree
                </p>
                <div className="space-y-3">
                  {/* Root node */}
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        0
                      </div>
                      {branches.length > 0 && (
                        <div className="w-px flex-1 bg-indigo-400/30 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                        Original Story
                      </p>
                      <p className="text-xs text-slate-300 line-clamp-3 leading-5">
                        {story.content}
                      </p>
                    </div>
                  </div>

                  {/* Branch nodes */}
                  {branches.map((branch, idx) => (
                    <div key={branch.id} className="flex items-start gap-3 ml-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${branch.id === activeBranchId
                              ? "bg-cyan-400 text-slate-950 ring-2 ring-cyan-300/50"
                              : "bg-slate-700 text-slate-300"
                            }`}
                        >
                          {idx + 1}
                        </div>
                        {idx < branches.length - 1 && (
                          <div className="w-px flex-1 bg-slate-700/50 mt-1" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleExtendBranch(branch)}
                        className={`flex-1 rounded-xl border p-3 text-left transition-all duration-200 ${branch.id === activeBranchId
                            ? "border-cyan-400/40 bg-cyan-400/10"
                            : "border-white/10 bg-white/5 hover:border-indigo-400/30 hover:bg-white/10"
                          }`}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                          Branch {idx + 1} · Depth {branch.depth}
                        </p>
                        <p className="text-xs text-slate-300 line-clamp-4 leading-5">
                          {branch.continuation}
                        </p>
                        <p className="mt-2 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300">
                          Continue from here →
                        </p>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Prompt Editor ───────────────────────────────────────────── */}
            <section>
             <label
                htmlFor="continue-story-prompt"
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400"
              >
                {activeBranch
                  ? `Continuing from Branch ${branches.indexOf(activeBranch) + 1}`
                  : "Story Context (pre-seeded)"}
              </label>
              <div className="relative w-full">
                <textarea
                  id="continue-story-prompt"
                  rows={8}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="The story continues..."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/20 transition-all leading-6"
                />
                {/* ── Dynamic Character Counter ── */}
                 <div className="absolute bottom-3 right-4 text-[11px] font-medium text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-sm pointer-events-none select-none tracking-wider border border-white/5">
                 {prompt ? prompt.length : 0} / 500
                 </div>
              </div>
              <p className="mt-1.5 text-[10px] text-slate-600 flex justify-between items-center">
                <span>
                  {!isAuthenticated && (
                    <span className="text-amber-400">
                      ⚡ Using free tier — sign in for higher limits.{" "}
                    </span>
                  )}
                  Edit the context above, then generate the next part.
                </span>
              </p>
            </section>

            {/* ── Actions ─────────────────────────────────────────────────── */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="continue-story-generate-btn"
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-400 hover:to-violet-400 hover:shadow-indigo-400/30 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating…
                  </>
                ) : (
                  <>✦ Generate Continuation</>
                )}
              </button>
              {branches.length > 0 && (
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-400 hover:shadow-cyan-400/30 active:scale-[0.97]"
                >
                  ✓ Apply to Story
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContinueStoryModal;
