import React from "react";
import { useGetProfileInfoQuery } from "../../../redux/apis/user.api";
import SSProfile from "../../ui-component/ss-profile/ss-profile";
import { Link } from "react-router-dom";

const FeatureProfileComponent = () => {
  const { data } = useGetProfileInfoQuery(undefined);
  return (
    <section className="bg-blue-500/10 rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center mb-6">
        <SSProfile
          name={data?.name as string}
          imageUrl={data?.profile.avatar}
        />
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-300">{data?.name}</h3>
          <p className="text-sm text-slate-600 dark:text-gray-400">{data?.email}</p>
        </div>
      </div>
      <div className="border-t border-b border-slate-300 dark:border-gray-500 py-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-slate-700 dark:text-gray-400">
              {data?.postsCount}
            </p>
            <p className="text-sm text-slate-500 dark:text-gray-500">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-700 dark:text-gray-400">
              {data?.followers.length}
            </p>
            <p className="text-sm text-slate-500 dark:text-gray-500">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-700 dark:text-gray-400">
              {data?.following.length}
            </p>
            <p className="text-sm text-slate-500 dark:text-gray-500">Following</p>
          </div>
        </div>
      </div>
      <Link to="/stories">
        <button className="!rounded-button w-full bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 cursor-pointer">
          Generate Story <i className="fas fa-magic ml-2"></i>
        </button>
      </Link>
    </section>
  );
};

export default FeatureProfileComponent;
