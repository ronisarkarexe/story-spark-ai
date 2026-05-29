import React, { useState } from "react";
import { useGetUsersListQuery } from "../../../redux/apis/user.api";
import { User } from "../../../models/user";
import LoadingAnimation from "../../loading/loading.component";

const UserComponent = () => {
  const { data: users, isLoading } = useGetUsersListQuery(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = (users?.data ?? []).filter((user: User) => {
    const searchValue = searchTerm.toLowerCase().trim();
    const nameMatch = user.name?.toLowerCase().includes(searchValue) ?? false;
    const emailMatch = user.email?.toLowerCase().includes(searchValue) ?? false;
    return nameMatch || emailMatch;
  });

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-850 dark:text-white flex items-center gap-3">
            <i className="fas fa-users text-indigo-500"></i> User Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-450 mt-1">
            Manage, filter, and review accounts across the platform.
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 h-11 pl-4 bg-white border border-slate-200 rounded-xl text-slate-800 dark:bg-slate-900/60 dark:border-slate-700/50 dark:text-gray-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
            placeholder="Search users..."
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 transition"
              title="Clear search"
              type="button"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
          ) : (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <i className="fas fa-search text-sm"></i>
            </div>
          )}
        </div>
      </div>

      {/* User Table Card */}
      <div className="bg-slate-50 border border-slate-200 dark:bg-white/[0.02] dark:border-white/[0.06] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="p-4 py-4 text-xs font-bold uppercase tracking-wider pl-6">Name</th>
                <th className="p-4 py-4 text-xs font-bold uppercase tracking-wider">Email Address</th>
                <th className="p-4 py-4 text-xs font-bold uppercase tracking-wider">Account Status</th>
                <th className="p-4 py-4 text-xs font-bold uppercase tracking-wider">Subscription Tier</th>
                <th className="p-4 py-4 text-xs font-bold uppercase tracking-wider pr-6">Applied Writer</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/60 dark:divide-white/[0.04]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: User) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-slate-100/50 dark:hover:bg-white/[0.01] transition duration-200"
                  >
                    <td className="p-4 py-4.5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{user.name}</p>
                      </div>
                    </td>
                    <td className="p-4 py-4.5">
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{user.email}</p>
                    </td>
                    <td className="p-4 py-4.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.status === "active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"
                          : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-red-500"}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 py-4.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        user.subscriptionType === "premium"
                          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                          : user.subscriptionType === "pro"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                          : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:border-slate-700"
                      }`}>
                        {user.subscriptionType}
                      </span>
                    </td>
                    <td className="p-4 py-4.5 pr-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        user.isApplyForWriter 
                          ? "bg-blue-50 text-blue-700 border border-blue-150 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                          : "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-450 dark:border-slate-750"
                      }`}>
                        {user.isApplyForWriter ? (
                          <>
                            <i className="fas fa-check text-[10px]"></i> YES
                          </>
                        ) : (
                          <>
                            <i className="fas fa-times text-[10px]"></i> NO
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-12 text-slate-500 dark:text-slate-450 font-medium">
                    <i className="fas fa-search-minus text-3xl mb-3 block text-slate-350"></i>
                    No matching users found in the system
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
