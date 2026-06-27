import React, { useContext, useState } from "react";
import {
  useGetProfileInfoQuery,
  useUpdateProfileMutation,
} from "../../../redux/apis/user.api";
import { User } from "../../../models/user";
import toast, { Toaster } from "react-hot-toast";
import { ProfileSettingComponent } from "./profile.setting.component";
import { ProfileSavedStoriesSection } from "./profile.saved_stories.component";
import { WriterApplicationForm } from "./writer_application.form";
import AuthContext from "../../auth.context";
import { ProfileCompletionIndicator } from "./ProfileCompletionIndicator";
import { instance } from "../../../helpers/axios/axiosInstance";
import {
  useGetWritingStreakQuery,
  useGetAchievementsQuery,
} from "../../../redux/apis/gamification.api";
import StreakCard from "../../StreakCard";
import AchievementsGrid from "../../AchievementsGrid";
import { WritingGoalsForm } from "./profile.goals.component";

const ProfileComponent = () => {
  const { data, isLoading } = useGetProfileInfoQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"settings" | "stats" | "goals">("settings");
  const auth = useContext(AuthContext);

  const { data: streakData, isLoading: isStreakLoading } = useGetWritingStreakQuery(undefined, {
    skip: !data,
  });
  const { data: achievementsData, isLoading: isAchievementsLoading } = useGetAchievementsQuery(undefined, {
    skip: !data,
  });

  const onSave = async (data: Partial<User>) => {
    setLoading(true);
    try {
      const result = await updateProfile(data).unwrap();
      if (result) {
        toast.success("Profile updated successfully.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteAccount = async () => {
    if (!data || deleting) {
      return;
    }

    const confirmed = window.confirm(
      "This will permanently delete your account and all related data. Continue?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    try {
      await instance.delete(`/user/${data._id}`);
      toast.success("Account deleted successfully.");
      auth?.logout();
    } catch {
      toast.error("Unable to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
        <div className="w-full">
          <div className="bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/50 rounded-xl shadow-lg overflow-hidden">
            {/* Header Skeleton */}
            <div className="bg-indigo-650 px-6 py-5 border-b border-slate-200 dark:border-slate-700/50">
              <div className="h-7 bg-white/40 rounded-md w-48 mb-2" />
              <div className="h-4 bg-white/30 rounded-md w-64" />
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Basic Info Section */}
              <div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700/50 rounded-md w-36 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700/40 rounded-md w-20 mb-2" />
                    <div className="h-10 bg-slate-100 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-700/30 rounded-lg w-full" />
                  </div>
                  <div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700/40 rounded-md w-28 mb-2" />
                    <div className="h-10 bg-slate-100 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-700/30 rounded-lg w-full" />
                  </div>
                  <div className="md:col-span-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700/40 rounded-md w-24 mb-2" />
                    <div className="h-10 bg-slate-100 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-700/30 rounded-lg w-full" />
                  </div>
                  <div className="md:col-span-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700/40 rounded-md w-12 mb-2" />
                    <div className="h-24 bg-slate-100 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-700/30 rounded-lg w-full" />
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700/50 rounded-md w-28 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700/40 rounded-md w-24 mb-2" />
                      <div className="h-10 bg-slate-100 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-700/30 rounded-lg w-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Status Section */}
              <div>
                <div className="h-6 bg-slate-200 dark:bg-slate-700/50 rounded-md w-32 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-slate-100 border border-slate-200 dark:bg-slate-900/40 p-4 rounded-lg dark:border-slate-700/30">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700/40 rounded-md w-12 mb-2" />
                      <div className="h-6 bg-slate-200 dark:bg-slate-700/50 rounded-md w-20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons Skeleton */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200 dark:border-slate-800/50">
                <div className="h-10 bg-slate-200 dark:bg-slate-700/30 rounded-lg w-24" />
                <div className="h-10 bg-indigo-600/30 rounded-lg w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 pb-12">
      {data && (
        <>
          {/* Tabbed Navigation Bar */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-2">
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "settings"
                  ? "border-indigo-600 text-indigo-650 dark:text-indigo-400 dark:border-indigo-500"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              <i className="fas fa-cog"></i> Settings
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "stats"
                  ? "border-indigo-600 text-indigo-650 dark:text-indigo-400 dark:border-indigo-500"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              <i className="fas fa-trophy"></i> Stats & Achievements
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className={`px-5 py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "goals"
                  ? "border-indigo-600 text-indigo-650 dark:text-indigo-400 dark:border-indigo-500"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              }`}
            >
              <i className="fas fa-bullseye"></i> Writing Goals
            </button>
          </div>

          {/* Conditional Tab Rendering */}
          {activeTab === "settings" && (
            <div className="space-y-8 animate-fadeIn">
              <ProfileCompletionIndicator
                name={data.name}
                bio={data.profile?.bio}
                avatar={data.profile?.avatar}
                socialLinks={data.profile?.social}
              />

              <ProfileSettingComponent
                user={data}
                onSave={onSave}
                loading={loading}
                onDeleteAccount={onDeleteAccount}
                deleting={deleting}
              />
              <ProfileSavedStoriesSection />
              <WriterApplicationForm user={data} />
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <StreakCard streak={streakData} isLoading={isStreakLoading} />
                </div>
                <div className="md:col-span-2">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-md h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                        Writing Summary
                      </h3>
                      <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                        Track your progress and activity on Story Spark AI. Publish stories to unlock achievements and increase your writing streak!
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05]">
                        <p className="text-xs text-slate-550 dark:text-slate-400">Total Stories</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                          {data.postsCount ?? 0}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05]">
                        <p className="text-xs text-slate-550 dark:text-slate-400">Account Type</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white mt-1 capitalize">
                          {data.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-250 dark:border-slate-800/60 pt-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                  Unlocked Achievements & Badges
                </h3>
                <AchievementsGrid achievements={achievementsData?.achievements} isLoading={isAchievementsLoading} />
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="animate-fadeIn">
              <WritingGoalsForm
                user={data}
                onSave={onSave}
                loading={loading}
              />
            </div>
          )}
        </>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};



export default ProfileComponent;
