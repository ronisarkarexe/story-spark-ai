import { useMemo } from "react";

interface ProfileCompletionProps {
  name?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

interface CompletionField {
  label: string;
  completed: boolean;
  hint: string;
}

export function ProfileCompletionIndicator({
  name,
  bio,
  avatar,
  socialLinks,
}: ProfileCompletionProps) {
  const fields: CompletionField[] = useMemo(
    () => [
      {
        label: "Name",
        completed: !!name?.trim(),
        hint: "Add your display name",
      },
      {
        label: "Bio",
        completed: !!bio?.trim(),
        hint: "Write a short bio about yourself",
      },
      {
        label: "Avatar",
        completed: !!avatar?.trim(),
        hint: "Upload a profile picture",
      },
      {
        label: "Social Links",
        completed: !!(
          socialLinks?.twitter ||
          socialLinks?.github ||
          socialLinks?.website
        ),
        hint: "Add at least one social link",
      },
    ],
    [name, bio, avatar, socialLinks]
  );

  const completedCount = fields.filter((f) => f.completed).length;
  const percentage = Math.round((completedCount / fields.length) * 100);

  const getBarColor = () => {
    if (percentage === 100) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-400";
  };

  const incomplete = fields.filter((f) => !f.completed);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Profile Completion
        </h3>
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Field Checklist */}
      <ul className="space-y-1.5 mb-4">
        {fields.map((field) => (
          <li key={field.label} className="flex items-center gap-2 text-sm">
            {field.completed ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-gray-400">○</span>
            )}
            <span
              className={
                field.completed
                  ? "text-gray-700 dark:text-gray-300"
                  : "text-gray-400 dark:text-gray-500"
              }
            >
              {field.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Suggestions for incomplete fields */}
      {incomplete.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Suggestions:
          </p>
          <ul className="space-y-1">
            {incomplete.map((field) => (
              <li
                key={field.label}
                className="text-xs text-indigo-500 dark:text-indigo-400"
              >
                → {field.hint}
              </li>
            ))}
          </ul>
        </div>
      )}

      {percentage === 100 && (
        <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">
          🎉 Your profile is complete!
        </p>
      )}
    </div>
  );
}