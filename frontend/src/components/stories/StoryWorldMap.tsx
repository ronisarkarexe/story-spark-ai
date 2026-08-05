import React from "react";

interface Location {
  name: string;
  description: string;
}

interface StoryWorldMapProps {
  locations: Location[];
  onClose: () => void;
}

const StoryWorldMap: React.FC<StoryWorldMapProps> = ({
  locations,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 w-full max-w-3xl rounded-2xl p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-white">
            🗺️ Story World Map
          </h2>

          <button
            onClick={onClose}
            className="text-white hover:text-red-400"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className="bg-slate-800 p-4 rounded-xl border border-purple-500 hover:scale-105 transition"
            >
              <h3 className="text-lg font-bold text-purple-300">
                📍 {location.name}
              </h3>

              <p className="text-slate-300 mt-2">
                {location.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryWorldMap;