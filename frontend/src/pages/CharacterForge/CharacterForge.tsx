import React, { useState } from 'react';

interface CharacterFormState {
  name: string;
  archetype: string;
  backstory: string;
  personalityTraits: string;
  abilitiesOrSkills: string;
  aiPromptContext: string;
}

const CharacterForge: React.FC = () => {
  const [formData, setFormData] = useState<CharacterFormState>({
    name: '',
    archetype: '',
    backstory: '',
    personalityTraits: '',
    abilitiesOrSkills: '',
    aiPromptContext: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Parse out comma-separated strings into arrays before posting to your backend API
      const payload = {
        ...formData,
        userId: "60d5ec49f1b2c513f88f01a1", // Placeholder until linked to auth state context
        personalityTraits: formData.personalityTraits.split(',').map(t => t.trim()).filter(Boolean),
        abilitiesOrSkills: formData.abilitiesOrSkills.split(',').map(s => s.trim()).filter(Boolean)
      };

      const response = await fetch('http://localhost:5000/api/v1/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: '✨ Character forged successfully inside the archive!' });
        setFormData({ name: '', archetype: '', backstory: '', personalityTraits: '', abilitiesOrSkills: '', aiPromptContext: '' });
      } else {
        setMessage({ type: 'error', text: `Error: ${data.message || 'Failed to forge character'}` });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Failed to connect to the forge gate.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            ⚒️ Character Forge Companion
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Shape your next-generation storytelling persona and core traits.
          </p>
        </div>

        {/* Status Alerts */}
        {message && (
          <div className={`p-4 rounded-md mb-6 text-sm font-medium ${
            message.type === 'success' ? 'bg-green-900/50 border border-green-500 text-green-200' : 'bg-red-900/50 border border-red-500 text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Core Form Layout */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Character Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., Eldrin Thorne" className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-white" required />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Archetype Class</label>
              <input type="text" name="archetype" value={formData.archetype} onChange={handleInputChange} placeholder="e.g., Rogue Mage, AI Renegade" className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-white" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Personality Traits (Separated by commas)</label>
            <input type="text" name="personalityTraits" value={formData.personalityTraits} onChange={handleInputChange} placeholder="e.g., Cynical, Highly Intellectual, Cautious" className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-white" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Abilities or Skills (Separated by commas)</label>
            <input type="text" name="abilitiesOrSkills" value={formData.abilitiesOrSkills} onChange={handleInputChange} placeholder="e.g., Chronomancy, Infiltration, Hacking" className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-white" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Backstory Narrative</label>
            <textarea name="backstory" value={formData.backstory} onChange={handleInputChange} rows={4} placeholder="Briefly write the origin chronicles or background saga..." className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-white resize-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">AI Behavior Context & Prompts</label>
            <textarea name="aiPromptContext" value={formData.aiPromptContext} onChange={handleInputChange} rows={3} placeholder="Instruct the engine how to portray this character (e.g., Speak cryptically, use high-tech slang...)" className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition text-white resize-none" required />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Forging Character...' : 'Forge Core Persona'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CharacterForge;