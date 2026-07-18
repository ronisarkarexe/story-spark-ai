import { useEffect } from "react";

interface StoryMeta {
  title: string;
  description?: string;
  imageUrl?: string;
}

export function useStoryMeta({ title, description, imageUrl }: StoryMeta) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    document.title = `${title} – Story Spark AI`;

    const setMeta = (sel: string, val: string) => {
      const el = document.querySelector<HTMLMetaElement>(sel);
      if (el) el.content = val;
    };

    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:description"]', description);
    }
    if (imageUrl) {
      setMeta('meta[property="og:image"]', imageUrl);
      setMeta('meta[name="twitter:image"]', imageUrl);
    }

    setMeta('meta[property="og:title"]', `${title} – Story Spark AI`);
    setMeta('meta[name="twitter:title"]', `${title} – Story Spark AI`);
  }, [title, description, imageUrl]);
}