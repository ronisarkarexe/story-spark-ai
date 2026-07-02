import { useCollaboration } from '../hooks/useCollaboration';

export default function StoryPage({ storyId }) {
  const { content, users, sendUpdate } = useCollaboration(storyId);

  return (
    <div>
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