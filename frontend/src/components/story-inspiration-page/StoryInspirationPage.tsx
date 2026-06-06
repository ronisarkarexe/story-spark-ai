import React, { useState } from 'react';
import { getBaseUrl } from '../../helpers/config';

const StoryInspirationPage: React.FC = () => {
  const [intro, setIntro] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchIdeas = async () => {
    setLoading(true);
    setError('');
    setIdeas([]);
    try {
      const response = await fetch(`${getBaseUrl()}/story-inspiration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intro }),
      });
      if (!response.ok) throw new Error('Failed to fetch ideas');
      const data = await response.json();
      setIdeas(data.data?.ideas || data.ideas || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Get Story Inspiration</h2>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={4}
        placeholder="Enter your story intro..."
        value={intro}
        onChange={e => setIntro(e.target.value)}
      />
    <div className="flex gap-2">
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    onClick={fetchIdeas}
    disabled={loading || !intro.trim()}
  >
    {loading ? 'Generating...' : 'Get Ideas'}
  </button>

  {intro.trim() && (
    <button
      type="button"
      onClick={() => {
        setIntro('');
        setIdeas([]);
        setError('');
      }}
      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
    >
      Clear Prompt
    </button>
  )}
</div>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {ideas.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Story Ideas:</h3>
          <ul className="list-disc pl-6">
            {ideas.map((idea, idx) => (
              <li key={idx} className="mb-2">{idea}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StoryInspirationPage;
