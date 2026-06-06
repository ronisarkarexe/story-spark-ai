import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center px-4">
      <motion.h1
        className="text-9xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        404
      </motion.h1>
      <motion.p
        className="text-lg mt-4 text-gray-400 max-w-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Oops! The page you are looking for does not exist. It might have been
        moved or deleted.
      </motion.p>
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <Link
          to="/"
          className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-full shadow-md hover:bg-blue-600 transition"
        >
          ⬅ Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundComponent;
