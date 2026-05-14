import logo from "../../assets/logoNew.png";

const FooterComponent = () => {
  return (
    <div>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img className="h-16" src={logo} alt="AIStoriesBook" />
            <p className="mt-4 text-sm text-gray-500">
              Empowering voices through the art of writing. Connect, create, and
              inspire.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Platform
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/help-center"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Guidelines
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="mt-4 text-base text-gray-500">
              Get the latest updates and news.
            </p>
            <form className="mt-4">
              <div className="flex">
                <input
                  type="email"
                  className="!rounded-button form-input block w-full bg-white border border-gray-300 rounded-l-md px-3"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="!rounded-button -ml-px relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-indigo-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-400 pt-8 flex items-center justify-between">
          <p className="text-base text-gray-400">
            &copy; 2025 StorySpark.AI - All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterComponent;
