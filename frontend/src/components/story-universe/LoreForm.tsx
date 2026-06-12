import React, { useState, useEffect } from "react";
import { IMemoryPayload, IUniverseMemory } from "../../redux/apis/universe.api";

interface LoreFormProps {
  initialData?: IUniverseMemory | null;
  onSubmit: (data: IMemoryPayload) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const LORE_TYPES = [
  { value: "character", label: "Character Profile", icon: "fas fa-user-ninja" },
  { value: "relationship", label: "Relationship Dynamic", icon: "fas fa-heart-broken" },
  { value: "location", label: "Location / Setting", icon: "fas fa-map-marked-alt" },
  { value: "event", label: "Historical Event", icon: "fas fa-history" },
  { value: "rule", label: "World Rule / Law", icon: "fas fa-scroll" },
  { value: "magic_system", label: "Magic System / Lore", icon: "fas fa-magic" },
  { value: "object", label: "Object / Artifact", icon: "fas fa-gem" },
  { value: "other", label: "Other / Misc", icon: "fas fa-ellipsis-h" },
];

export const LoreForm: React.FC<LoreFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [type, setType] = useState<string>("character");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tagsInput, setTagsInput] = useState<string>("");
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setTitle(initialData.title);
      setContent(initialData.content);
      setTagsInput(initialData.tags ? initialData.tags.join(", ") : "");
      
      const attrs = initialData.attributes
        ? Object.entries(initialData.attributes).map(([key, value]) => ({
            key,
            value: String(value),
          }))
        : [];
      setAttributes(attrs.length > 0 ? attrs : [{ key: "", value: "" }]);
    } else {
      setType("character");
      setTitle("");
      setContent("");
      setTagsInput("");
      setAttributes([{ key: "", value: "" }]);
    }
  }, [initialData]);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...attributes];
    updated[index][field] = val;
    setAttributes(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // Convert attributes array back to record object
    const attrsObj: Record<string, string> = {};
    attributes.forEach((attr) => {
      if (attr.key.trim()) {
        attrsObj[attr.key.trim()] = attr.value.trim();
      }
    });

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      type,
      title: title.trim(),
      content: content.trim(),
      attributes: attrsObj,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Lore Type
          </label>
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200 shadow-sm focus:border-indigo-500 focus:outline-none appearance-none"
            >
              {LORE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <i className="fas fa-chevron-down text-xs"></i>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Title / Name
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Eldrin, Elderwood Forest, Magic Rules"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Description / Content
        </label>
        <textarea
          required
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe this lore aspect in detail. The AI engine will read this description during story generation for consistency."
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none resize-y"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Lore Attributes (Key-Value)
          </label>
          <button
            type="button"
            onClick={handleAddAttribute}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer"
          >
            <i className="fas fa-plus"></i> Add Attribute
          </button>
        </div>
        
        <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
          {attributes.map((attr, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                value={attr.key}
                onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                placeholder="Attribute (e.g. Age, Alliance)"
                className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={attr.value}
                onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                placeholder="Value (e.g. 150, Elven Rebellion)"
                className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveAttribute(index)}
                className="text-rose-500 hover:text-rose-450 p-2 cursor-pointer"
                aria-label="Remove attribute"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))}
          {attributes.length === 0 && (
            <p className="text-xs text-slate-500 italic">No custom attributes added yet.</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. hero, magic, forest, historical"
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-semibold shadow transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Saving...
            </>
          ) : (
            "Save Lore Entry"
          )}
        </button>
      </div>
    </form>
  );
};
