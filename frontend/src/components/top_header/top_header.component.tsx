import { useState } from "react";
import logo from "../../assets/logo.png";
import ImageFallback from "../ImageFallback";

const TopHeaderComponent = () => {
import { useGetProfileInfoQuery } from "../../redux/apis/user.api";
function TopHeaderComponent() {
  const [, setShowNotification] = useState<boolean>(false);
  const { data } = useGetProfileInfoQuery();
  return (
    <div className="sticky top-0 z-50">
      <div className="relative z-10 mx-auto max-w-8xl px-6 py-4 gradient-bg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-16">
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="flex items-center space-x-2">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
              </a>
              <a href="/" className="text-white hover:text-custom transition">
                HOME
              </a>
              <a
                href="/http_codes"
                className="text-white hover:text-custom transition"
              >
                EXPLORE
              </a>
              <a
                href="/repos"
                className="text-white hover:text-custom transition"
              >
                CATEGORIES
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="!rounded-button bg-blue hover:bg-blue text-white px-6 py-2 font-medium transition-all">
              JOIN
            </button>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                type="button"
                className="!rounded-button p-2 text-gray-400 hover:text-gray-500"
              >
                <i className="fas fa-search"></i>
              </button>
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="!rounded-button p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                    onClick={() => setShowNotification(true)}
                  >
                    <i className="fa-solid fa-bell"></i>
                  </button>
                </div>
              </div>
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="!rounded-button bg-white flex text-sm rounded-full focus:outline-none"
                  >
                    <ImageFallback
                      className="h-8 w-8 rounded-full"
                      src="https://avatars.githubusercontent.com/u/76697055?v=4"
                      alt="profile"
                    />
                    <img
                     className="h-8 w-8 rounded-full"
                     src={data?.profile?.avatar || "https://ui-avatars.com/api/?name=User"}
                     alt="profile"
                      />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
  );
}

export default TopHeaderComponent;
