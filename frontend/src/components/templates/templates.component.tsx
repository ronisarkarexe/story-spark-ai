import React from "react";
import { useNavigate } from "react-router-dom";
import ImageFallback from "../ImageFallback";

interface TemplateCardProps {
  category: string;
  title: string;
  description: string;
  prompt: string;
  icon: string;
  color: string;
  image: string;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  category,
  title,
  description,
  prompt,
  icon,
  color,
  image,
}) => {
  const navigate = useNavigate();

  const handleUseTemplate = () => {
    navigate("/stories", { state: { prompt } });
  };

  return (
    <div className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/20 hover:border-indigo-500/50 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-1">
      {/* Banner Image with Zoom Effect */}
      <div className="relative h-48 overflow-hidden w-full shrink-0 bg-[#0B0F19]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent z-10 pointer-events-none"></div>
        <ImageFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        {/* Category badge */}
        <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-wider text-indigo-300 uppercase shadow-lg">
          {category}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-20 -mt-10">
        {/* Icon overlay */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20 mb-4 ${color} relative z-30 ring-4 ring-[#0B0F19]`}>
          <i className={`${icon} text-xl text-white`}></i>
        </div>
        
        <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-indigo-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 mb-6 flex-grow leading-relaxed text-sm">
          {description}
        </p>
        <button
          onClick={handleUseTemplate}
          className="mt-auto w-full py-3.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-300 hover:text-indigo-200 font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <span>Use Template</span>
          <i className="fas fa-arrow-right text-sm transform group-hover/btn:translate-x-1 transition-transform"></i>
        </button>
      </div>
    </div>
  );
};

const TemplatesComponent = () => {
  const navigate = useNavigate();

  const storyTemplates = [
    {
      category: "Story Writing",
      title: "Fantasy Story",
      description: "Craft epic tales of magic, legendary heroes, and mythical realms.",
      prompt: "Write a fantasy story about a magical kingdom, hidden secrets, and an unexpected hero.",
      icon: "fas fa-dragon",
      color: "bg-emerald-500",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Story Writing",
      title: "Mystery Story",
      description: "Build suspenseful narratives with twists, clues, and revelations.",
      prompt: "Write a suspenseful mystery involving a strange disappearance and an unexpected twist.",
      icon: "fas fa-user-secret",
      color: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Story Writing",
      title: "Romance Story",
      description: "Create emotional journeys of connection, love, and relationships.",
      prompt: "Write a heartwarming romance story about two people meeting under unusual circumstances.",
      icon: "fas fa-heart",
      color: "bg-pink-500",
      image: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Story Writing",
      title: "Horror Story",
      description: "Thrill your readers with chilling atmospheres and haunting entities.",
      prompt: "Write a chilling horror story involving a haunted place and an unknown presence.",
      icon: "fas fa-ghost",
      color: "bg-red-500",
      image: "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Story Writing",
      title: "Sci-Fi Story",
      description: "Explore futuristic technologies, space travel, and cosmic mysteries.",
      prompt: "Write a science fiction story about humanity's first encounter with an advanced alien civilization.",
      icon: "fas fa-rocket",
      color: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Story Writing",
      title: "Adventure Story",
      description: "Embark on thrilling quests full of danger, discovery, and action.",
      prompt: "Write an action-packed adventure story about explorers searching for a lost ancient artifact.",
      icon: "fas fa-compass",
      color: "bg-amber-500",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const creativeTemplates = [
    {
      category: "Creative Writing",
      title: "Character Backstory",
      description: "Flesh out deep, compelling histories and motivations for your characters.",
      prompt: "Create a detailed backstory for a mysterious character with hidden motivations.",
      icon: "fas fa-user-astronaut",
      color: "bg-indigo-500",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Creative Writing",
      title: "Dialogue Starter",
      description: "Generate natural and engaging conversations between characters.",
      prompt: "Write an intense and revealing dialogue between two old friends who share a dark secret.",
      icon: "fas fa-comments",
      color: "bg-teal-500",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Creative Writing",
      title: "Plot Generator",
      description: "Spark new ideas with dynamic and unexpected story outlines.",
      prompt: "Outline a compelling plot for a novel where the protagonist wakes up with a special ability.",
      icon: "fas fa-project-diagram",
      color: "bg-orange-500",
      image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Creative Writing",
      title: "Poem Writing",
      description: "Express emotions and vivid imagery through rhythmic poetry.",
      prompt: "Write a beautiful and emotional poem about the passage of time and fleeting memories.",
      icon: "fas fa-feather-alt",
      color: "bg-fuchsia-500",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Creative Writing",
      title: "Short Story Starter",
      description: "Get the perfect opening paragraph to kickstart your short fiction.",
      prompt: "Write a gripping opening paragraph for a short story set in a dystopian future.",
      icon: "fas fa-book-open",
      color: "bg-cyan-500",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const inspirationTemplates = [
    {
      category: "Writing Inspiration",
      title: "Story Prompt Generator",
      description: "Endless creative sparks to overcome the blank page.",
      prompt: "Give me 5 unique and thought-provoking story prompts involving time travel.",
      icon: "fas fa-lightbulb",
      color: "bg-yellow-500",
      image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Writing Inspiration",
      title: "Writer's Block Breaker",
      description: "Push past creative hurdles with targeted writing exercises.",
      prompt: "I am experiencing writer's block. Provide a fun, unconventional 5-minute writing exercise to get me started.",
      icon: "fas fa-hammer",
      color: "bg-rose-500",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Writing Inspiration",
      title: "Scene Builder",
      description: "Construct vivid, atmospheric environments for your narratives.",
      prompt: "Describe in vivid, sensory detail a bustling marketplace in a cyberpunk city.",
      icon: "fas fa-city",
      color: "bg-violet-500",
      image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="bg-gradient-to-br animate-gradient-slow min-h-screen pb-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-150px] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Back Button */}
        <div className="mb-4">
          <button 
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0)] hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          >
            <i className="fas fa-arrow-left text-sm transform group-hover:-translate-x-1 transition-transform"></i>
            <span className="text-sm font-semibold tracking-wide">Back to Home</span>
          </button>
        </div>
        {/* Hero Section */}
        <div className="text-center mb-24 relative mt-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/20 rounded-[100%] blur-[120px] -z-10 pointer-events-none"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-widest uppercase mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Professional Writing Templates
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-300 mb-8 tracking-tight drop-shadow-2xl">
            Writing Templates
          </h1>
          <p className="text-xl text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Skip the blank page. Choose from beautifully crafted templates for stories, poems, characters, and creative inspiration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button 
              onClick={() => navigate('/stories')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Start Writing <i className="fas fa-magic"></i>
            </button>
            <a href="#categories" className="px-8 py-4 rounded-xl border font-bold text-lg transition-all duration-300 backdrop-blur-sm w-full sm:w-auto text-center  bg-white text-slate-700 border-slate-300  hover:bg-slate-100 hover:border-indigo-500 hover:text-indigo-600 hover:-translate-y-1 hover:shadow-lg  dark:bg-white/5 dark:text-gray-200 dark:border-white/10 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300">
              Browse Templates
            </a>
          </div>
        </div>

        {/* Categories Section */}
        <div id="categories" className="space-y-24">
          
          {/* Story Writing */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
                <i className="fas fa-book-open"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-100">Story Writing</h2>
              <div className="h-px bg-gradient-to-r from-emerald-500/50 to-transparent flex-grow ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {storyTemplates.map((template, index) => (
                <TemplateCard key={index} {...template} />
              ))}
            </div>
          </section>

          {/* Creative Writing */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-400">
                <i className="fas fa-pen-nib"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-100">Creative Writing</h2>
              <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent flex-grow ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {creativeTemplates.map((template, index) => (
                <TemplateCard key={index} {...template} />
              ))}
            </div>
          </section>

          {/* Writing Inspiration */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center border border-pink-500/30 text-pink-400">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-100">Writing Inspiration</h2>
              <div className="h-px bg-gradient-to-r from-pink-500/50 to-transparent flex-grow ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {inspirationTemplates.map((template, index) => (
                <TemplateCard key={index} {...template} />
              ))}
            </div>
          </section>

        </div>

        {/* CTA Section */}
        <div className="mt-32 mb-10 relative rounded-3xl p-[1px] bg-gradient-to-b from-indigo-500/40 via-indigo-500/10 to-transparent overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          <div className="relative bg-gradient-to-b from-[#0f1423]/90 to-[#0B0F19]/90 backdrop-blur-xl rounded-3xl p-12 md:p-20 border border-white/5 text-center overflow-hidden h-full w-full shadow-2xl">
            <div className="absolute -top-32 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -z-10 pointer-events-none transition-all duration-700 group-hover:bg-blue-500/30"></div>
            <div className="absolute -bottom-32 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -z-10 pointer-events-none transition-all duration-700 group-hover:bg-indigo-500/30"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 mb-6 tracking-tight drop-shadow-xl">
                Your next great story starts here ✨
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Choose a template, spark an idea, and let Story Spark AI turn your imagination into something unforgettable.
              </p>
              <button 
                onClick={() => navigate('/stories')}
                className="group/btn px-10 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto border border-white/10"
              >
                <span>Start Creating</span>
                <i className="fas fa-arrow-right transform group-hover/btn:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TemplatesComponent;
