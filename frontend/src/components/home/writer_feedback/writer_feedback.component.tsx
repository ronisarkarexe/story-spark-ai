import React from "react";
import { Quote } from "lucide-react";
import { useGetReviewsQuery } from "../../../redux/apis/review.api";
import type { Review } from "../../../models/review";
import defaultAvatar from "../../../assets/logoNew.png";
import ImageFallback from "../../ImageFallback";
import ReviewForm from "./ReviewForm";
import { motion } from "framer-motion";

const sampleReviews: Review[] = [
  { _id: "sample-1", name: "Sarah J.", role: "Fiction Writer", feedback: "StorySparkAI completely cured my writer's block. The character suggestions are incredibly deep and nuanced.", imgSrc: "https://i.pravatar.cc/150?u=sarah" },
  { _id: "sample-2", name: "Marcus T.", role: "Screenwriter", feedback: "I use this tool daily to structure my screenplays. The pacing recommendations are spot on.", imgSrc: "https://i.pravatar.cc/150?u=marcus" },
  { _id: "sample-3", name: "Elena R.", role: "Indie Author", feedback: "Publishing my first novel wouldn't have been possible without the world-building assistance.", imgSrc: "https://i.pravatar.cc/150?u=elena" },
  { _id: "sample-4", name: "David K.", role: "Blogger", feedback: "Helps me generate fresh ideas for my weekly posts. It's like having a co-writer available 24/7.", imgSrc: "https://i.pravatar.cc/150?u=david" },
  { _id: "sample-5", name: "Aisha M.", role: "Student Writer", feedback: "Great for expanding my vocabulary and learning how to vary my sentence structures.", imgSrc: "https://i.pravatar.cc/150?u=aisha" },
  { _id: "sample-6", name: "James L.", role: "Content Creator", feedback: "The absolute best tool for drafting quick video scripts and narratives.", imgSrc: "https://i.pravatar.cc/150?u=james" },
  { _id: "sample-7", name: "Chloe F.", role: "Poet", feedback: "Surprisingly adept at maintaining rhythm and suggesting evocative imagery.", imgSrc: "https://i.pravatar.cc/150?u=chloe" },
  { _id: "sample-8", name: "Robert W.", role: "Storyteller", feedback: "I use it to build D&D campaigns. The lore generation is simply unmatched.", imgSrc: "https://i.pravatar.cc/150?u=robert" },
];

const ReviewCard = ({ writer }: { writer: Review }) => (
  <div className="creator-card group w-[280px] sm:w-[300px] shrink-0 p-5 sm:p-6 hover:-translate-y-1.5 flex flex-col justify-between h-full">
    <div className="absolute inset-0 bg-white/0 group-hover:bg-indigo-50/10 dark:group-hover:bg-indigo-500/5 transition-colors duration-300"></div>
    <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 -z-10"></div>
    
    <Quote className="text-indigo-400/20 w-8 h-8 absolute top-4 right-4 -z-10 group-hover:text-indigo-400/30 transition-colors" />

    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-4 mb-5 relative z-10">
      "{writer.feedback}"
    </p>
    <div className="flex items-center gap-3 mt-auto relative z-10">
      <img 
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-indigo-50 dark:ring-indigo-500/20" 
        src={writer.imgSrc || `https://i.pravatar.cc/150?u=${writer.name}`} 
        alt={writer.name} 
      />
      <div>
        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-tight">{writer.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{writer.role}</p>
      </div>
    </div>
  </div>
);

const WriterFeedbackComponent = () => {
  const { data: apiData = [], isLoading } = useGetReviewsQuery({});
  
  const displayData = apiData.length > 4 ? apiData : [...apiData, ...sampleReviews].slice(0, 10);

  const row1 = displayData.slice(0, Math.ceil(displayData.length / 2));
  const row2 = displayData.slice(Math.ceil(displayData.length / 2));
  
  const renderMarqueeRow = (items: Review[], direction: 'left' | 'right') => {
    if (items.length === 0) return null;
    const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';
    return (
      <div className="hidden md:flex w-max gap-4 sm:gap-6 pause-on-hover py-2">
        <div className={`flex w-max gap-4 sm:gap-6 items-stretch ${animationClass}`}>
          {[...items, ...items, ...items, ...items].map((writer, i) => (
            <ReviewCard key={`${writer._id ?? writer.name}-${direction}-${i}`} writer={writer} />
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) return <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">Loading reviews...</div>;

  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 sm:mb-10 max-w-2xl text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-surface mb-4 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
            </span>
            <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
              Trusted by 10,000+ Creators
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Writers</span> Say
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join thousands of creators who are elevating their storytelling and building worlds with Story Spark AI.
          </p>
          
          <div className="w-16 h-0.5 mt-6 rounded-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
        </motion.div>

        <div className="relative mb-12 sm:mb-16 marquee-mask -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 pt-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            {displayData.map((writer: Review, i: number) => (
              <div key={`mobile-${writer._id ?? writer.name}-${i}`} className="snap-center shrink-0 items-stretch flex">
                <ReviewCard writer={writer} />
              </div>
            ))}
          </div>

          <div className="hidden md:flex flex-col gap-4 sm:gap-6">
            {renderMarqueeRow(row1, 'left')}
            {renderMarqueeRow(row2, 'right')}
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ReviewForm />
        </motion.div>
      </div>
    </section>
  );
};

export default WriterFeedbackComponent;
