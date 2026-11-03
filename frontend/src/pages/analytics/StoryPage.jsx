import { Helmet } from 'react-helmet-async';
import { useCollaboration } from '../hooks/useCollaboration';

export default function StoryPage({ storyId }) {
  const { content, users, sendUpdate } = useCollaboration(storyId);

  // Derive a short preview for the description and title
  const storyTitle = content ? content.split('\n')[0].substring(0, 40) : "Loading Story...";
  const storyDescription = content ? `${content.substring(0, 120)}...` : "Collaborate on this story in real-time.";

  return (
    <div>
      {/* Dynamic document head metadata for active users */}
      <Helmet>
        <title>{storyTitle} | Story Spark AI</title>
        <meta property="og:title" content={storyTitle} />
        <meta property="og:description" content={storyDescription} />
        <meta property="og:url" content={`https://storysparkai.vercel.app/story/${storyId}`} />
      </Helmet>

      <div className="flex justify-between">
        <h1>Story</h1>
        <div>{users.length} users online</div>
      </div>
      <textarea
        value={content}
        onChange={(e) => sendUpdate(e.target.value)}
        className="w-full h-64 p-4 border rounded"
      />
    </div>
  );
}