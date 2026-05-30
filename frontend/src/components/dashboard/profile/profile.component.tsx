import React, { useState } from "react";
import {
  useGetProfileInfoQuery,
  useUpdateProfileMutation,
} from "../../../redux/apis/user.api";
import { User } from "../../../models/user";
import toast, { Toaster } from "react-hot-toast";
import { ProfileSettingComponent } from "./profile.setting.component";
import { ProfileSavedStoriesSection } from "./profile.saved_stories.component";
import { WriterApplicationForm } from "./writer_application.form";

const ProfileComponent = () => {
  const { data, isLoading } = useGetProfileInfoQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [loading, setLoading] = useState<boolean>(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="max-w-3xl mx-auto">
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
    <div className="pb-12">
      {data && (
        <>
          <ProfileSettingComponent
            user={data}
            onSave={onSave}
            loading={loading}
          />
          <ProfileSavedStoriesSection />
          <WriterApplicationForm user={data} />
        </>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default ProfileComponent;
