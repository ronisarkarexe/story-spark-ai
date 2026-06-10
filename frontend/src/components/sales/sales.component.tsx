import React from "react";
import { Link } from "react-router-dom";

const salesData = [
  { id: 1, plan: "Pro Monthly", user: "user@example.com", amount: "$9.99", date: "2026-05-20", status: "Paid" },
  { id: 2, plan: "Pro Monthly", user: "writer@example.com", amount: "$9.99", date: "2026-05-18", status: "Paid" },
];

const SalesComponent = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Sales Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your revenue and subscription activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              $19.98
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
            <p className="text-3xl font-bold text-green-500 mt-1">2</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Subscriptions</p>
            <p className="text-3xl font-bold text-purple-500 mt-1">2</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Recent Transactions
            </h2>
            <Link
              to="/pricing"
              className="text-sm text-indigo-500 hover:underline"
            >
              View Plans →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Plan</th>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {salesData.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4 text-gray-400">{row.id}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-200 font-medium">
                      {row.plan}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {row.user}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-200 font-semibold">
                      {row.amount}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {row.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-medium">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesComponent;