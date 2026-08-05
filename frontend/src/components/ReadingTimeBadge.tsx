import { getReadingTime } from "../utils/readingTime";

type Props = {
  text: string;
};

export default function ReadingTimeBadge({ text }: Props) {
  const { minutes, wordCount } = getReadingTime(text);
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {minutes} min read - {wordCount} words
    </p>
  );
}