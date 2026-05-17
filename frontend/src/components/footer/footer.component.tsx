
import { Link } from "react-router-dom";
import logo from "../../assets/logoNew.png";

const FooterComponent = () => {
  return (
    <div className="bg-black">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div>
            <a
              href="#"
              onClick={(e) => {
                      e.preventDefault();

                       window.scrollTo({
                       top: 0,
                       behavior: "smooth",
                         });
               }}
           >
            <img className="h-16" src={logo} alt="AIStoriesBook" />
             </a>
            <p className="mt-4 text-sm text-gray-400">
              Empowering voices through the art of writing. Connect, create,
              and inspire.
            </p>
          </div>
          {/* Platform Section */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Platform
            </h3>

            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-200"
                >
                  About Us
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Careers
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          {/* Resources Section */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Resources
            </h3>

            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Blog
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>

              <li>
                <Link
                  to="/community"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Community
                </Link>
              </li>

              <li>
                <a
                  href="#"
                  className="text-base text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Guidelines
                </a>
              </li>
            </ul>
          </div>
          {/* Newsletter Section */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Newsletter
            </h3>

            <p className="mt-4 text-base text-gray-400">
              Get the latest updates and news.
            </p>

            <form className="mt-4">
              <div className="flex">
                <input
                  type="email"
                  className="!rounded-button form-input block w-full bg-white border border-gray-300 rounded-l-md px-3 py-2 text-black"
                  placeholder="Enter your email"
                />

                <button
                  type="submit"
                  className="!rounded-button -ml-px relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Bottom Footer */}
        <div className="mt-8 border-t border-gray-700 pt-8 flex items-center justify-between">

          <p className="text-base text-gray-400">
            &copy; 2025 StorySpark.AI - All rights reserved.
          </p>
 </div>
      </div>
    </div>
  );
};

export default FooterComponent;