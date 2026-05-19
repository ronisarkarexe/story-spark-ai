import { useState } from "react";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      profile: {
        bio: formData.bio,
        avatar: formData.avatar,
        social: formData.social,
      },
    });
  };

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-blue-500/10 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-white/5 px-6 py-5">
            <h2 className="text-2xl font-bold text-white">User Settings</h2>
            <p className="text-indigo-200 mt-1">
              Manage your profile and social links
            </p>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 border-b border-white/5 pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/5 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/5 border border-gray-700 text-gray-400 placeholder-gray-500 rounded-lg cursor-not-allowed focus:outline-none transition-all duration-300"
                      disabled={true}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="avatar"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      id="avatar"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/5 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:outline-none transition-all duration-300"
                    />
                    {formData.avatar && (
                      <div className="mt-2">
                        <img
                          src={formData.avatar}
                          alt="Profile preview"
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-400 mb-1"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/5 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 border-b border-white/5 pb-2">
                  Social Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="facebook"
                      className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
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
                      className="w-full px-4 py-2 bg-white/5 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="twitter"
                      className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
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
                      className="w-full px-4 py-2 bg-white/5 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 focus:outline-none transition-all duration-300"
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
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
                      className="w-full px-4 py-2 bg-white/5 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-700/40 focus:border-blue-700 focus:outline-none transition-all duration-300"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="instagram"
                      className="block text-sm font-medium text-gray-400 mb-1 flex items-center"
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
                      className="w-full px-4 py-2 bg-white/5 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 focus:outline-none transition-all duration-300"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 border-b border-white/5 pb-2">
                  Account Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 text-blue-400">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Role</p>
                    <p className="text-lg font-bold capitalize">
                      {user.role}
                    </p>
                  </div>

                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20 text-purple-400">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Status
                    </p>
                    <p className="text-lg font-bold capitalize">
                      {user.status}
                    </p>
                  </div>

                  <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20 text-emerald-400">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      Subscription
                    </p>
                    <p className="text-lg font-bold capitalize">
                      {user.subscriptionType}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-700 rounded-lg text-gray-400 font-medium hover:bg-white/5 hover:text-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 rounded-lg text-white font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
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
