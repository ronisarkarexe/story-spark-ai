import { getReadingTime } from "../utils/readingTime";

type Props = {
  text: string;
};

export default function ReadingTimeBadge({ text }: Props) {
  const { minutes, wordCount, lessThanOneMinute } = getReadingTime(text);

  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {lessThanOneMinute ? "Less than 1 min read" : `⏱️ ${minutes} min read`}
      {wordCount > 0 ? ` · ${wordCount} words` : null}
    </p>
  );
}