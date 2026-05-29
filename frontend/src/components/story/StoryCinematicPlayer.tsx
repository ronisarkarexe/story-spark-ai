import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseStoryToScenes, StoryScene } from "./storySceneParser";
import { StoryAudioEngine } from "./storyAudioEngine";
import { getSceneVariants } from "./storyAnimationEngine";

interface StoryCinematicPlayerProps {
  content: string;
  title: string;
  genre: string;
  mood: { mood: string; backgroundStyle: string; particles?: string; };
  imageURL: string;
}

const audioEngine = new StoryAudioEngine();

const StoryCinematicPlayer: React.FC<StoryCinematicPlayerProps> = ({ content, title, genre, mood, imageURL }) => {
  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);

  useEffect(() => {
    // Stop any previous audio when unmounted or changing story
    return () => audioEngine.stopAll();
  }, []);

  useEffect(() => {
    const parsedScenes = parseStoryToScenes(content);
    setScenes(parsedScenes);
    setCurrentSceneIndex(-1);
    setIsPlaying(true);
    // Auto-advance to the first scene shortly after loading
    const timer = setTimeout(() => {
       setCurrentSceneIndex(0);
       setIsAudioInitialized(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, genre]);

  useEffect(() => {
    if (!isPlaying) {
      audioEngine.stopAll();
      return;
    }
  
    if (currentSceneIndex >= 0 && currentSceneIndex < scenes.length) {
      const currentScene = scenes[currentSceneIndex];
      
      if (isAudioInitialized) {
        audioEngine.playBackgroundMusic(genre);
        audioEngine.speakText(currentScene.text, currentScene.type === 'dialog');
      }

      // Estimate duration based on text length: avg 65ms per char, min 2500ms
      const readTimeMs = Math.max(2500, currentScene.text.length * 65); 

      const timeoutEvent = setTimeout(() => {
        if (currentSceneIndex < scenes.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
          audioEngine.stopAll();
        }
      }, readTimeMs);

      return () => clearTimeout(timeoutEvent);
    }
  }, [currentSceneIndex, isPlaying, scenes, genre, isAudioInitialized]);

  const variants = getSceneVariants(genre);

  return (
    <div className={`relative w-full h-[550px] overflow-hidden rounded-[1.8rem] border border-white/10 ${mood.backgroundStyle} shadow-2xl`}>
      {/* Background Image that smoothly transitions */}
      <motion.img 
        src={imageURL} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
        animate={{ scale: [1, 1.05, 1], filter: ["blur(1px)", "blur(3px)", "blur(1px)"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Background gradient overlay overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${mood.backgroundStyle} opacity-60 mix-blend-multiply`} />
      
      {/* HUD overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
         <div className="flex gap-2">
           <span className="bg-black/50 border border-white/10 text-white/90 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md uppercase tracking-widest">{genre || "Story"}</span>
           <span className="bg-black/50 border border-white/10 text-white/80 px-3 py-1 rounded-full text-xs backdrop-blur-md">{currentSceneIndex + 1} / {scenes.length}</span>
         </div>
         <button 
            type="button"
            onClick={() => {
              setIsPlaying(!isPlaying);
              if (isPlaying) audioEngine.stopAll();
            }} 
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-1.5 rounded-full text-sm font-medium backdrop-blur-md transition-all shadow-lg"
         >
            {isPlaying ? "Pause" : "Resume"}
         </button>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {scenes[currentSceneIndex] && (
            <motion.div
              key={scenes[currentSceneIndex].id}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center w-full max-w-3xl"
            >
              {scenes[currentSceneIndex].type === 'dialog' ? (
                 <div className="bg-slate-900/40 p-8 rounded-3xl border border-indigo-400/30 backdrop-blur-lg shadow-2xl relative">
                   <div className="absolute -top-3 left-8 bg-indigo-500 text-white text-xs px-2 py-1 rounded shadow-lg uppercase font-bold tracking-wider">Character</div>
                   <p className="text-2xl sm:text-3xl lg:text-4xl text-indigo-50 font-serif italic mb-2 leading-relaxed drop-shadow-md">
                     "{scenes[currentSceneIndex].text}"
                   </p>
                 </div>
              ) : (
                <div className="bg-black/20 p-6 rounded-2xl backdrop-blur-sm border border-white/5">
                  <p className="text-xl sm:text-2xl lg:text-3xl text-white font-medium leading-relaxed drop-shadow-2xl">
                    {scenes[currentSceneIndex].text}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-white/10 w-full z-20">
         <motion.div 
           className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
           initial={{ width: 0 }}
           animate={{ width: `${((currentSceneIndex + 1) / (scenes.length || 1)) * 100}%` }}
           transition={{ duration: 0.5 }}
         />
      </div>
    </div>
  );
};

export default StoryCinematicPlayer;
