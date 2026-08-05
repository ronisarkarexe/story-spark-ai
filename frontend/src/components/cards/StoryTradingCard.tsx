import React, { useMemo, useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { IStories } from "../stories/stories.view.component";
import { getWordCount } from "../stories/stories.utils";
import StoryCoverImage from "../stories/StoryCoverImage";
import { isSessionBookmarked, addSessionBookmark, removeSessionBookmark } from "../../utils/session-bookmarks";

export type StoryCardRarity = "Common" | "Rare" | "Epic" | "Legendary";

const rarityConfig: Record<
  StoryCardRarity,
  {
    accent: string;
    border: string;
    glow: string;
    label: string;
    rank: number;
  }
> = {
  Common: {
    accent: "from-slate-300 to-slate-500",
    border: "border-slate-300/70",
    glow: "shadow-slate-300/20",
    label: "Common",
    rank: 1,
  },
  Rare: {
    accent: "from-sky-300 to-blue-600",
    border: "border-blue-300/70",
    glow: "shadow-blue-400/30",
    label: "Rare",
    rank: 2,
  },
  Epic: {
    accent: "from-violet-300 to-fuchsia-600",
    border: "border-fuchsia-300/70",
    glow: "shadow-fuchsia-400/30",
    label: "Epic",
    rank: 3,
  },
  Legendary: {
    accent: "from-yellow-200 via-amber-400 to-orange-600",
    border: "border-amber-300/80",
    glow: "shadow-amber-400/40",
    label: "Legendary",
    rank: 4,
  },
};

const genreColorMap: Record<string, string> = {
  horror: "bg-red-500/20 text-red-100 border-red-300/40",
  romance: "bg-pink-500/20 text-pink-100 border-pink-300/40",
  fantasy: "bg-violet-500/20 text-violet-100 border-violet-300/40",
  "sci-fi": "bg-cyan-500/20 text-cyan-100 border-cyan-300/40",
  mystery: "bg-indigo-500/20 text-indigo-100 border-indigo-300/40",
  adventure: "bg-emerald-500/20 text-emerald-100 border-emerald-300/40",
  comedy: "bg-yellow-500/20 text-yellow-100 border-yellow-300/40",
  drama: "bg-orange-500/20 text-orange-100 border-orange-300/40",
};

const cleanText = (text: string) =>
  text
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// eslint-disable-next-line react-refresh/only-export-components
export const getStoryCardRarity = (content: string): StoryCardRarity => {
  const wordCount = getWordCount(content);

  if (wordCount > 600) return "Legendary";
  if (wordCount >= 400) return "Epic";
  if (wordCount >= 200) return "Rare";
  return "Common";
};

// eslint-disable-next-line react-refresh/only-export-components
export const getStoryCardId = (story: IStories) => {
  const source = `${story.uuid}-${story.title}-${story.tag}`;
  let hash = 0;

  for (let index = 0; index < source.length; index += 1) {
    hash = (hash << 5) - hash + source.charCodeAt(index);
    hash |= 0;
  }

  return `SS-${Math.abs(hash).toString(36).toUpperCase().slice(0, 6)}`;
};

// eslint-disable-next-line react-refresh/only-export-components
export const getStoryCardRank = (rarity: StoryCardRarity) =>
  rarityConfig[rarity].rank;

const getKeyQuote = (content: string) => {
  const sentences = cleanText(content).match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
  const quote =
    sentences
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .sort((a, b) => b.length - a.length)[0] || cleanText(content);

  return quote.length > 120 ? `${quote.slice(0, 117)}...` : quote;
};

const getGenreLabel = (story: IStories) =>
  cleanText(story.genre || story.tag || "Story").replace(/^[^\w]+/, "") ||
  "Story";

interface StoryTradingCardProps {
  story: IStories;
  compact?: boolean;
  onClose?: () => void;
}

const StoryTradingCard: React.FC<StoryTradingCardProps> = ({
  story,
  compact = false,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rarity = getStoryCardRarity(story.content);
  const [isBookmarked, setIsBookmarked] = useState(() => isSessionBookmarked(story.uuid));

  useEffect(() => {
    const handleBookmarkChange = () => {
      setIsBookmarked(isSessionBookmarked(story.uuid));
    };
    window.addEventListener("session_bookmarks_changed", handleBookmarkChange);
    return () => {
      window.removeEventListener("session_bookmarks_changed", handleBookmarkChange);
    };
  }, [story.uuid]);

  const rarityStyle = rarityConfig[rarity];
  const wordCount = getWordCount(story.content);
  const cardId = getStoryCardId(story);
  const keyQuote = useMemo(() => getKeyQuote(story.content), [story.content]);
  const genre = getGenreLabel(story);
  const genreClass =
    genreColorMap[genre.toLowerCase()] ||
    "bg-purple-500/20 text-purple-100 border-purple-300/40";

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyStory = async () => {
    const text = cleanText(story.content);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success("Story copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Could not copy story text.");
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    const toastId = toast.loading("Preparing trading card...");

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      const fileName =
        story.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
        "story-card";

      link.download = `${fileName}-trading-card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.dismiss(toastId);
      toast.success("Trading card downloaded!");
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Could not download this card.");
    }
  };

  const handleShare = async () => {
    const shareText = `I collected "${story.title}" as a ${rarity} StorySpark AI trading card (${cardId}).`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${story.title} Trading Card`,
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        toast.success("Share text copied!");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast.error("Unable to share this card.");
      }
    }
  };

  return (
    <div className={compact ? "" : "space-y-5"}>
      <style>
        {`
          @keyframes story-card-shimmer {
            0% { transform: translateX(-120%) rotate(18deg); }
            100% { transform: translateX(140%) rotate(18deg); }
          }
          .story-card-holo::after {
            content: "";
            position: absolute;
            inset: -35%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
            transform: translateX(-120%) rotate(18deg);
            transition: opacity 0.2s ease;
            opacity: 0.65;
            pointer-events: none;
          }
          .story-card-holo:hover::after {
            animation: story-card-shimmer 1.2s ease;
          }
        `}
      </style>

      <div
        ref={cardRef}
        className={`story-card-holo group relative mx-auto aspect-[5/7] w-full max-w-[360px]
        overflow-hidden rounded-2xl border ${rarityStyle.border}
        bg-slate-950 p-3 text-white shadow-2xl ${rarityStyle.glow}
        transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${rarityStyle.accent} opacity-20`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_80%_12%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_42%)]" />

        <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-950/50 backdrop-blur-lg">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/50">
                StorySpark Card
              </p>
              <h3 className="line-clamp-2 break-words text-lg font-black text-white overflow-hidden text-ellipsis">
                {story.title}
              </h3>
            </div>
            <span
              className={`shrink-0 rounded-full ${rarityStyle.accent} px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950 ring-1 ring-white/10 drop-shadow-md`}
            >
              {rarityStyle.label}
            </span>
          </div>

          <div className="relative m-3 h-40 overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-sm">
            <StoryCoverImage
              title={story.title}
              tag={story.tag}
              className="h-full w-full transition-transform duration-500 group-hover:scale-110"
              style={{ minHeight: "0", borderRadius: "0.75rem" }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isBookmarked) {
                  removeSessionBookmark(story.uuid);
                  toast.success("Removed from bookmarks");
                } else {
                  addSessionBookmark(story);
                  toast.success("Saved to session bookmarks!");
                }
              }}
              className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isBookmarked ? "Remove bookmark" : "Save story"}
            >
              <i className={`${isBookmarked ? "fas text-amber-400" : "far text-white/70"} fa-bookmark`}></i>
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${genreClass}`}
              >
                {genre}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold text-white">
                {story.language || "English"}
              </span>
            </div>
          </div>

            <div className="flex flex-1 flex-col px-4 pb-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                Key Quote
              </p>
              <p className="mt-2 line-clamp-4 text-sm font-medium italic leading-6 text-slate-100">
                "{keyQuote}"
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-sm p-2">
                <p className="text-lg font-black">{wordCount}</p>
                <p className="text-[9px] uppercase tracking-wider text-white/45">
                  Words
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-sm p-2">
                <p className="text-lg font-black">{rarityStyle.rank}</p>
                <p className="text-[9px] uppercase tracking-wider text-white/45">
                  Rank
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-sm p-2">
                <p className="text-lg font-black">
                  {story.tag.slice(0, 3).toUpperCase()}
                </p>
                <p className="text-[9px] uppercase tracking-wider text-white/45">
                  Class
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
              <span className="font-mono text-xs font-bold text-white/60">
                {cardId}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                Limited AI Edition
              </span>
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
          >
            <i className="fa-solid fa-download"></i>
            Download PNG
          </button>
          <button
            type="button"
            onClick={handleCopyStory}
            aria-label="Copy story to clipboard"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-500 active:scale-95"
          >
            <i className={`fa-solid ${isCopied ? "fa-check" : "fa-clipboard"}`}></i>
            {isCopied ? "Copied!" : "Copy Story"}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            <i className="fa-solid fa-share-nodes"></i>
            Share Card
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
            >
              Close
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StoryTradingCard;
