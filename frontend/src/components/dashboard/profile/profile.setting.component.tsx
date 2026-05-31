import { useState, ChangeEvent, FormEvent } from "react";
import { User } from "../../../models/user";

interface ProfileSettingComponentProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
  loading: boolean;
}

export const ProfileSettingComponent = ({ user, onSave, loading }: ProfileSettingComponentProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.profile?.bio || "",
    avatar: user.profile?.avatar || "",
    social: {
      facebook: user.profile?.social?.facebook || "",
      twitter: user.profile?.social?.twitter || "",
      linkedin: user.profile?.social?.linkedin || "",
      instagram: user.profile?.social?.instagram || "",
    },
  });
  const [nameError, setNameError] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("social.")) {
      const socialField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name?.trim();
    if (!trimmedName) {
      setNameError("Full Name cannot be empty.");
      return;
    }

    setNameError("");
    onSave({
      name: trimmedName,
      profile: {
        bio: formData.bio,
        avatar: formData.avatar,
        social: formData.social,
      },
    });
  };

  const inputClassName =
    "w-full px-4 py-2 border border-slate-350 rounded-lg bg-white text-slate-800 dark:bg-slate-900/70 dark:text-gray-100 dark:border-slate-700/50 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-lg dark:border-white/[0.06] dark:bg-white/[0.02]">
          <div className="bg-indigo-600 px-6 py-5 sm:px-8">
            <h2 className="text-2xl font-bold text-white">User Settings</h2>
            <p className="text-indigo-200 mt-1">
              Manage your profile and social links
            </p>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            <form onSubmit={handleSubmit}>
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-300 mb-6 border-b border-slate-200 dark:border-slate-750 pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:gap-x-14">
                  <div className="min-w-0">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                    {nameError && (
                      <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">
                        {nameError}
                      </p>
                    )}
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className={`${inputClassName} cursor-not-allowed`}
                      disabled={true}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      className={`${inputClassName} min-h-[96px]`}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-300 mb-6 border-b border-slate-200 dark:border-slate-750 pb-2">
                  Social Links
                </h3>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-12 md:gap-y-8 lg:gap-x-14">
                  <div className="min-w-0">
                    <label
                      htmlFor="facebook"
                      className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                      Facebook
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      name="social.facebook"
                      value={formData.social.facebook}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="twitter"
                      className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                      Twitter
                    </label>
                    <input
                      type="url"
                      id="twitter"
                      name="social.twitter"
                      value={formData.social.twitter}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-blue-700"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="social.linkedin"
                      value={formData.social.linkedin}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="instagram"
                      className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-1 flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-pink-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                      Instagram
                    </label>
                    <input
                      type="url"
                      id="instagram"
                      name="social.instagram"
                      value={formData.social.instagram}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-300 mb-6 border-b border-slate-200 dark:border-slate-750 pb-2">
                  Account Status
                </h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Role</p>
                    <p className="text-lg font-semibold text-blue-900 dark:text-blue-300 capitalize">
                      {user.role}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 dark:bg-purple-950/20 dark:border-purple-900/30">
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                      Status
                    </p>
                    <p className="text-lg font-semibold text-purple-900 dark:text-purple-300 capitalize">
                      {user.status}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      Subscription
                    </p>
                    <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-300 capitalize">
                      {user.subscriptionType}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:justify-end sm:space-x-4 sm:space-x-reverse dark:border-slate-700/50">
                <button
                  type="button"
                  className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100 dark:border-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
