import React, { useState } from 'react';
import './CharacterPlanner.css';

export default function CharacterPlanner({ onContextUpdate }) {
  const [character, setCharacter] = useState({
    name: '',
    archetype: 'Protagonist',
    traits: '',
    initialGoal: ''
  });

  const [arcStep, setArcStep] = useState('Introduction');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...character, [name]: value };
    setCharacter(updated);
    if (onContextUpdate) onContextUpdate({ character: updated, currentArcStep: arcStep });
  };

  const handleArcChange = (step) => {
    setArcStep(step);
    if (onContextUpdate) onContextUpdate({ character, currentArcStep: step });
  };

  return (
    <div className="cp-planner-container">
      <div className="cp-header-block">
        <h3>✨ Character Arc Planner</h3>
        <p>Lock persistent narrative profile boundaries into generation payloads.</p>
      </div>

      {/* Dossier Meta Form */}
      <div className="cp-form-group">
        <label>Character Name</label>
        <input 
          type="text" 
          name="name" 
          value={character.name} 
          onChange={handleInputChange} 
          placeholder="e.g., Kaelen Vane"
        />
      </div>

      <div className="cp-form-group">
        <label>Core Archetype</label>
        <select name="archetype" value={character.archetype} onChange={handleInputChange}>
          <option value="Protagonist">Protagonist</option>
          <option value="Antagonist">Antagonist</option>
          <option value="Mentor">Mentor</option>
          <option value="Catalyst">Catalyst</option>
        </select>
      </div>

      <div className="cp-form-group">
        <label>Persistent Trait Matrix (Comma Separated)</label>
        <input 
          type="text" 
          name="traits" 
          value={character.traits} 
          onChange={handleInputChange} 
          placeholder="e.g., Observant, fiercely loyal, scar on left jaw"
        />
      </div>

      {/* Narrative Arc Milestones Tracker */}
      <div className="cp-arc-section">
        <label>Active Plot Arc Step Alignment</label>
        <div className="cp-arc-timeline">
          {['Introduction', 'Climax', 'Resolution'].map((step) => (
            <button
              key={step}
              type="button"
              className={`cp-arc-node ${arcStep === step ? 'active' : ''}`}
              onClick={() => handleArcChange(step)}
            >
              {step}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}