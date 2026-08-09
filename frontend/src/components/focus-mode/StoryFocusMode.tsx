import { useEffect, useState } from "react";
import {
  loadFocusModeSettings,
  saveFocusModeSettings,
  toggleFocusMode,
} from "../../utils/storyFocusMode";

interface Props {
  story: string;
}

export default function StoryFocusMode({
  story,
}: Props) {

  const [settings, setSettings] =
    useState(loadFocusModeSettings());

  useEffect(() => {
    saveFocusModeSettings(settings);
  }, [settings]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-white">
          📖 Reading Focus Mode
        </h2>

        <button
          onClick={() =>
            setSettings(toggleFocusMode(settings))
          }
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          {settings.enabled ? "Disable" : "Enable"}
        </button>

      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <label className="text-white">
          Font Size

          <input
            type="range"
            min={14}
            max={28}
            value={settings.fontSize}
            onChange={(e) =>
              setSettings({
                ...settings,
                fontSize: Number(e.target.value),
              })
            }
          />
        </label>

        <label className="text-white">
          Line Spacing

          <input
            type="range"
            min={1.2}
            max={2.5}
            step={0.1}
            value={settings.lineSpacing}
            onChange={(e) =>
              setSettings({
                ...settings,
                lineSpacing: Number(e.target.value),
              })
            }
          />
        </label>

        <label className="text-white">
          Content Width

          <input
            type="range"
            min={500}
            max={1000}
            step={50}
            value={settings.contentWidth}
            onChange={(e) =>
              setSettings({
                ...settings,
                contentWidth: Number(e.target.value),
              })
            }
          />
        </label>

        <select
          value={settings.theme}
          onChange={(e) =>
            setSettings({
              ...settings,
              theme: e.target.value as "light" | "dark",
            })
          }
          className="rounded bg-zinc-800 p-2 text-white"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

      </div>

      <div
        className={`rounded-lg border p-6 ${
          settings.theme === "dark"
            ? "bg-zinc-950 text-white"
            : "bg-white text-black"
        }`}
        style={{
          maxWidth: settings.contentWidth,
          fontSize: settings.fontSize,
          lineHeight: settings.lineSpacing,
          margin: "0 auto",
        }}
      >
        {story || "Story preview..."}
      </div>

    </div>
  );
}