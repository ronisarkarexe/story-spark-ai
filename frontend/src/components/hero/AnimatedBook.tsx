import { type FC } from "react";
import { motion } from "framer-motion";

const sparkleConfig = [
  { left: "12%", top: "18%", size: 8, delay: 0 },
  { left: "82%", top: "22%", size: 6, delay: 0.4 },
  { left: "42%", top: "8%", size: 10, delay: 0.8 },
  { left: "18%", top: "64%", size: 7, delay: 1.2 },
  { left: "70%", top: "72%", size: 5, delay: 1.6 },
];


const AnimatedBook: FC = () => {
  return (
    <div className="w-full max-w-[420px]">
      <motion.div
        initial={{ y: 0, opacity: 0.98 }}
        whileHover={{ y: -10, scale: 1.01 }}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
className="relative overflow-visible p-2"      >
        <div className="pointer-events-none absolute inset-0 rounded-[2.25rem] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),transparent_32%)]" />

       

          <div className="relative mx-auto h-[320px] w-full max-w-[320px]">
          <motion.div
  animate={{
    y: [0, -15, 0],
    rotate: [0, 10, 0],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
  }}
  className="absolute left-0 top-8 text-3xl"
>
  ✨
</motion.div>

<motion.div
  animate={{
    y: [0, -10, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
  }}
  className="absolute right-0 top-14 text-3xl"
>
  ⭐
</motion.div>

<motion.div
  animate={{
    y: [0, -12, 0],
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
  }}
  className="absolute left-8 bottom-12 text-3xl"
>
  🪶
</motion.div>
            <motion.div
  animate={{
    y: [0, -10, 0],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
  }}
  className="relative mx-auto flex items-center justify-center w-[290px] h-[260px]"
>
  <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full" />

 <div
  className="
    absolute
    left-0
    top-0
    w-[140px]
    h-[200px]
    rounded-l-2xl
    bg-gradient-to-br
    from-purple-700
    to-indigo-900
    shadow-2xl
  "
></div>
<motion.div
  animate={{
    rotateY: [0, 12, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
  }}
  className="
    absolute
    left-[20px]
    top-[10px]
    w-[110px]
    h-[180px]
    bg-white
    rounded-lg
    shadow-md
    origin-right
    z-10
  "
/>
<motion.div
  animate={{
    rotateY: [0, -18, 0],
  }}
  transition={{
    duration: 3.5,
    repeat: Infinity,
  }}
  className="
    absolute
    left-[24px]
    top-[10px]
    w-[110px]
    h-[180px]
    bg-slate-50
    rounded-lg
    shadow-md
    origin-right
  "
/>
<motion.div
  animate={{
    rotateY: [0, 55, 0],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
  }}
  className="
    absolute
    left-[20px]
    top-[10px]
    w-[110px]
    h-[180px]
    bg-white
    rounded-lg
    shadow-xl
    origin-right
    z-10
  "
/>
<motion.div
  animate={{
    rotateY: [0, 8, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
  }}
  className="
    absolute
    right-[20px]
    top-[10px]
    w-[110px]
    h-[180px]
    bg-white
    rounded-lg
    shadow-md
    origin-left
    z-10
  "
/>
<div
  className="
    absolute
    right-[40px]
    top-[10px]
    w-[110px]
    h-[180px]
    bg-slate-50
    rounded-lg
    shadow-md
  "
/>

<div className="absolute left-1/2 top-4 -translate-x-1/2 h-[180px] w-[2px] bg-yellow-300/50" />
<div className="absolute left-1/2 top-4 -translate-x-[3px] h-[180px] w-[1px] bg-yellow-300/30" />
<div className="absolute left-1/2 top-4 translate-x-[4px] h-[180px] w-[1px] bg-yellow-300/30" />
  
  <div
  className="
    absolute
    left-1/2
    top-0
    -translate-x-1/2
    h-[210px]
    w-3
    bg-gradient-to-b
    from-yellow-900
    via-amber-700
    to-yellow-900
    rounded-full
    shadow-lg
    z-0
  "
/>
<div
  className="
    absolute
    right-0
    top-0
    w-[140px]
    h-[200px]
    rounded-r-2xl
    bg-gradient-to-br
    from-blue-600
    to-cyan-500
    shadow-2xl
    z-0
  "
/>
<motion.div
  animate={{
    rotateY: [0, 70, 0],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
  }}
  className="
    absolute
    left-[40px]
    top-[20px]
    w-[95px]
    h-[170px]
    bg-white
    rounded-lg
    shadow-xl
    origin-right
    z-10
  "
/>
  <motion.div
    animate={{
      y: [0, -20, 0],
      rotate: [0, 20, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
    }}
    className="absolute -top-10 left-5 text-4xl"
  >
    ✨
  </motion.div>

  <motion.div
    animate={{
      y: [0, -15, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
    }}
    className="absolute -top-8 right-5 text-4xl"
  >
    ⭐
  </motion.div>

  <motion.div
    animate={{
      y: [0, -18, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
    }}
    className="absolute -bottom-5 left-20 text-3xl"
  >
    🪶
  </motion.div>
  
</motion.div>

          {sparkleConfig.map((sparkle, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.6, 1.05, 0.6] }}
              transition={{ duration: 2.5, delay: sparkle.delay, repeat: Infinity, ease: "easeInOut" }}
              className="absolute rounded-full bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.5)] dark:bg-slate-100/90"
              style={{ left: sparkle.left, top: sparkle.top, width: sparkle.size, height: sparkle.size }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedBook;
   