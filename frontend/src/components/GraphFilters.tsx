import React from "react";

interface GraphFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  minStrength: number;
  onMinStrengthChange: (val: number) => void;
  onClear: () => void;
}

const RELATIONSHIP_TYPES = [
  "Friend", "Family", "Rival", "Mentor", "Ally", "Enemy", "Romantic Interest", "Unknown"
];

const GraphFilters = ({
  search,
  onSearchChange,
  selectedTypes,
  onTypesChange,
  minStrength,
  onMinStrengthChange,
  onClear,
}: GraphFiltersProps) => {
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 w-full md:w-80 shadow-md h-fit text-sm text-slate-300">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
        <h3 className="font-bold text-white text-base">Filters</h3>
        <button
          onClick={onClear}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition"
        >
          Clear Filters
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-400">Search Character</label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Type name..."
            className="w-full h-9 bg-zinc-950 border border-zinc-800 rounded-lg px-3 pl-8 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs"></i>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-400">Relationship Types</label>
        <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
          {RELATIONSHIP_TYPES.map((type) => {
            const isChecked = selectedTypes.includes(type);
            return (
              <label
                key={type}
                className={`flex items-center justify-center gap-1.5 px-2 py-1 rounded border text-[10px] font-semibold cursor-pointer transition select-none ${
                  isChecked
                    ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-200"
                    : "bg-zinc-950 border-zinc-800 hover:bg-zinc-800/30 text-slate-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleType(type)}
                  className="hidden"
                />
                {type}
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-slate-400">Min Relationship Strength</label>
          <span className="text-xs font-bold text-indigo-400">{minStrength}</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={minStrength}
          onChange={(e) => onMinStrengthChange(Number(e.target.value))}
          className="w-full accent-indigo-500 bg-zinc-950 rounded-lg cursor-pointer h-1.5"
        />
      </div>
    </div>
  );
};

export default GraphFilters;
