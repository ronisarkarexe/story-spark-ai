import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <div className="w-full flex items-center justify-center py-12 bg-transparent">
      <div className="relative w-20 h-20">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-3 h-3 bg-blue-500 rounded-full"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: [0, 30 * Math.cos((index * 2 * Math.PI) / 8)],
              y: [0, 30 * Math.sin((index * 2 * Math.PI) / 8)],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingAnimation;
