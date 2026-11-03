import React, { useState, useMemo, useEffect } from "react";
import "./LoreManager.css";

export type LoreCategory = "location" | "rule" | "magic_system" | "character" | "faction" | "general";

export interface LoreEntry {
  id: number;
  key: string;
  category: LoreCategory;
  content: string;
  is_active: boolean;
  user_id?: string;
  universe_id?: string;
  created_at?: number;
}

const PRESET_SAMPLE_ENTRIES: Omit<LoreEntry, "id">[] = [
  {
    key: "Hogwarts",
    category: "location",
    content: "A magical school in Scotland hidden from muggles by ancient charm protections.",
    is_active: true,
  },
  {
    key: "Shadow Magic",
    category: "magic_system",
    content: "Requires shadow essence harvested under a dark moon. Cannot be cast in direct sunlight.",
    is_active: true,
  },
  {
    key: "Law of Equivalence",
    category: "rule",
    content: "To create something through alchemy, an object of equal value must be sacrificed.",
    is_active: true,
  },
  {
    key: "Eldoria",
    category: "location",
    content: "Floating capital city of the Cloud Realm, powered by Aether Crystals.",
    is_active: true,
  },
];

export const LoreManager: React.FC = () => {
  const [entries, setEntries] = useState<LoreEntry[]>([
    {
      id: 1,
      key: "Hogwarts",
      category: "location",
      content: "A magical school in Scotland hidden from muggles by ancient charm protections.",
      is_active: true,
    },
    {
      id: 2,
      key: "Shadow Magic",
      category: "magic_system",
      content: "Requires shadow essence harvested under a dark moon. Cannot be cast in direct sunlight.",
      is_active: true,
    },
    {
      id: 3,
      key: "Law of Equivalence",
      category: "rule",
      content: "To create something through alchemy, an object of equal value must be sacrificed.",
      is_active: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    key: string;
    category: LoreCategory;
    content: string;
    is_active: boolean;
  }>({
    key: "",
    category: "general",
    content: "",
    is_active: true,
  });

  // Simulator State
  const [testPrompt, setTestPrompt] = useState<string>(
    "Write a short scene about a new student arriving at Hogwarts to learn Shadow Magic."
  );
  const [testGenerationResult, setTestGenerationResult] = useState<string | null>(null);

  // Matcher Logic for Live Simulator
  const matchedEntries = useMemo(() => {
    if (!testPrompt.trim()) return [];
    const lowerPrompt = testPrompt.toLowerCase();

    return entries.filter((entry) => {
      if (!entry.is_active || !entry.key.trim()) return false;
      const keyLower = entry.key.toLowerCase();

      // Escape special regex chars
      const escapedKey = keyLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(`\\b${escapedKey}\\b`, "i");
      return pattern.test(lowerPrompt);
    });
  }, [testPrompt, entries]);

  // Form Handlers
  const handleOpenAddModal = () => {
    setEditingEntryId(null);
    setFormData({
      key: "",
      category: "general",
      content: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entry: LoreEntry) => {
    setEditingEntryId(entry.id);
    setFormData({
      key: entry.key,
      category: entry.category,
      content: entry.content,
      is_active: entry.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key.trim() || !formData.content.trim()) return;

    if (editingEntryId !== null) {
      setEntries((prev) =>
        prev.map((item) =>
          item.id === editingEntryId
            ? { ...item, ...formData, key: formData.key.trim(), content: formData.content.trim() }
            : item
        )
      );
    } else {
      const newEntry: LoreEntry = {
        id: Date.now(),
        key: formData.key.trim(),
        category: formData.category,
        content: formData.content.trim(),
        is_active: formData.is_active,
      };
      setEntries((prev) => [newEntry, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteEntry = (id: number) => {
    if (window.confirm("Are you sure you want to delete this lore entry?")) {
      setEntries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_active: !item.is_active } : item))
    );
  };

  const handleAddPresets = () => {
    const existingKeys = new Set(entries.map((e) => e.key.toLowerCase()));
    const newItems: LoreEntry[] = PRESET_SAMPLE_ENTRIES.filter(
      (p) => !existingKeys.has(p.key.toLowerCase())
    ).map((p, idx) => ({ ...p, id: Date.now() + idx }));

    if (newItems.length > 0) {
      setEntries((prev) => [...newItems, ...prev]);
    }
  };

  // Filtered entries for grid display
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || entry.category === selectedCategory;
      const matchesActive = !showActiveOnly || entry.is_active;

      return matchesSearch && matchesCategory && matchesActive;
    });
  }, [entries, searchQuery, selectedCategory, showActiveOnly]);

  // Construct Injected Prompt Block for Live Simulator Preview
  const injectedSystemPromptPreview = useMemo(() => {
    if (matchedEntries.length === 0) {
      return "No active lore keywords detected in prompt.";
    }

    const loreLines = [
      "[WORLD LORE & RULES - STRICT ADHERENCE REQUIRED]",
      "The story prompt references specific world elements below. You MUST strictly adhere to all of the following rules, locations, and lore constraints without contradiction:",
    ];

    matchedEntries.forEach((entry) => {
      loreLines.push(`• [${entry.key} (${entry.category.toUpperCase()})]: ${entry.content}`);
    });

    return loreLines.join("\n");
  }, [matchedEntries]);

  const handleRunSimulator = () => {
    if (matchedEntries.length === 0) {
      setTestGenerationResult(
        "No matching lore entries were detected. Standard prompt sent to AI generator."
      );
      return;
    }

    const matchedKeys = matchedEntries.map((e) => `'${e.key}' (${e.category})`).join(", ");
    setTestGenerationResult(
      `✓ Dynamic Context Injector Activated!\n` +
        `Injected ${matchedEntries.length} lore rule(s): ${matchedKeys}.\n\n` +
        `Generated Response Preview:\n` +
        `"The narrative unfolds adhering to the rules of ${matchedEntries.map((e) => e.key).join(" and ")} accurately."`
    );
  };

  return (
    <div className="lore-manager-container" data-testid="lore-manager">
      {/* Header */}
      <div className="lore-header">
        <h1 className="lore-header-title">
          <span className="lore-header-icon">📖</span> Lorebook Manager
        </h1>
        <p className="lore-header-description">
          Define custom locations, rules, magic systems, and factions. The dynamic context injector automatically
          detects keywords in your prompt and injects strict directives into the LLM system prompt.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="lore-controls">
        <div className="lore-search-group">
          <input
            type="text"
            className="lore-search-input"
            placeholder="Search lore by keyword or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="lore-search-input"
          />
          <select
            className="lore-filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            data-testid="lore-category-select"
          >
            <option value="all">All Categories</option>
            <option value="location">Locations</option>
            <option value="rule">Rules</option>
            <option value="magic_system">Magic Systems</option>
            <option value="character">Characters</option>
            <option value="faction">Factions</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="lore-action-buttons">
          <button className="btn-secondary" onClick={handleAddPresets}>
            + Add Presets
          </button>
          <button className="btn-primary" onClick={handleOpenAddModal} data-testid="add-entry-btn">
            + New Lore Entry
          </button>
        </div>
      </div>

      {/* Lore Entries Grid */}
      <div className="lore-grid" data-testid="lore-entries-grid">
        {filteredEntries.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem 1rem", color: "#64748b" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>No Lorebook entries found.</p>
            <p style={{ fontSize: "0.9rem" }}>Add a new entry or click "+ Add Presets" to get started.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="lore-card" data-testid={`lore-card-${entry.id}`}>
              <div>
                <div className="lore-card-header">
                  <h3 className="lore-card-key">{entry.key}</h3>
                  <div className="lore-card-meta">
                    <span className={`badge badge-${entry.category}`}>{entry.category.replace("_", " ")}</span>
                    <span className={`badge ${entry.is_active ? "badge-active" : "badge-inactive"}`}>
                      {entry.is_active ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>
                <p className="lore-card-content">{entry.content}</p>
              </div>

              <div className="lore-card-actions">
                <button className="btn-icon" onClick={() => handleToggleActive(entry.id)}>
                  {entry.is_active ? "Disable" : "Enable"}
                </button>
                <button className="btn-icon" onClick={() => handleOpenEditModal(entry)}>
                  Edit
                </button>
                <button
                  className="btn-icon btn-icon-danger"
                  onClick={() => handleDeleteEntry(entry.id)}
                  data-testid={`delete-btn-${entry.id}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dynamic Context Injector Playground / Simulator */}
      <div className="simulator-section" data-testid="simulator-section">
        <div className="simulator-header">
          <span style={{ fontSize: "1.6rem" }}>⚡</span>
          <h2 className="simulator-title">Dynamic Context Injector Simulator</h2>
        </div>
        <p style={{ color: "#94a3b8", fontSize: "0.92rem", marginBottom: "1rem" }}>
          Type a story prompt below to test keyword detection and view the live LLM System Prompt injection.
        </p>

        <textarea
          className="prompt-input"
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
          placeholder="Enter a story prompt to test lore matching (e.g. Hogwarts)..."
          data-testid="simulator-prompt-input"
        />

        <div className="matched-box">
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#cbd5e1" }}>
            Detected Keywords Matched ({matchedEntries.length}):
          </div>
          <div className="matched-tags">
            {matchedEntries.length === 0 ? (
              <span style={{ fontSize: "0.85rem", color: "#64748b" }}>No keywords matched in current prompt.</span>
            ) : (
              matchedEntries.map((e) => (
                <span key={e.id} className={`badge badge-${e.category}`}>
                  ✓ {e.key}
                </span>
              ))
            )}
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.4rem" }}>
            Injected System Prompt Preview:
          </div>
          <div className="prompt-preview-block" data-testid="system-prompt-preview">
            {injectedSystemPromptPreview}
          </div>
        </div>

        <button className="btn-primary" onClick={handleRunSimulator} data-testid="run-simulator-btn">
          Test Generation Injector
        </button>

        {testGenerationResult && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "8px",
              color: "#34d399",
              whiteSpace: "pre-wrap",
              fontSize: "0.9rem",
            }}
          >
            {testGenerationResult}
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Lore Entry */}
      {isModalOpen && (
        <div className="lore-modal-overlay" data-testid="lore-modal">
          <div className="lore-modal">
            <h2 style={{ margin: "0 0 1.25rem 0", color: "#f8fafc", fontSize: "1.4rem" }}>
              {editingEntryId ? "Edit Lore Entry" : "Create New Lore Entry"}
            </h2>

            <form onSubmit={handleSaveEntry}>
              <div className="form-group">
                <label className="form-label">Keyword / Entity Name (Key)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Hogwarts, Shadow Magic, Law of Equivalence"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  required
                  data-testid="entry-key-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as LoreCategory })}
                  data-testid="entry-category-input"
                >
                  <option value="location">Location</option>
                  <option value="rule">Rule</option>
                  <option value="magic_system">Magic System</option>
                  <option value="character">Character</option>
                  <option value="faction">Faction</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Lore Content / Rule Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Define specific rules, locations, or properties that the AI must strictly adhere to..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  data-testid="entry-content-input"
                />
              </div>

              <div className="form-group">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span>Active (Inject into prompts when keyword is mentioned)</span>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" data-testid="save-entry-btn">
                  Save Lore Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoreManager;
