"use client";
import { useRouter } from "next/navigation";

const RedirectButton = ({ 
    url = '/visualizer',
    className = '',
    buttonText = 'Go Back',
    icon = true
  }) => {
    const router = useRouter();

    const handleRedirect = () => {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push(url);
      }
    };
  
    return (
      <button
        onClick={handleRedirect}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-black bg-transparent dark:text-white dark:border-gray-200 transition-colors duration-200 text-gray-700 ${className}`}
        aria-label={buttonText}
      >
        {icon && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
        {buttonText}
      </button>
    );
  };
  
  export default RedirectButton;