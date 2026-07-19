import re

with open('frontend/src/components/stories/stories.view.component.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_block = """  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-16 relative overflow-hidden box-border">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none select-none" />

      {/* Error Banner */}
      {errorMessage && (
        <div className="error-banner mb-6 p-4 bg-amber-500/20 border border-amber-500 rounded-xl text-amber-200 flex justify-between items-center animate-fadeIn relative z-20">
          <div className="flex items-center gap-3">
            <span>⚠️</span>
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-xs uppercase font-bold tracking-wider hover:text-white px-2 py-1 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start relative z-10 w-full box-border">
        
        {/* Writing Achievement Dashboard */}
<StoryAchievementDashboard
  totalStories={stories.length}
/>

        {/* ── Left Column ── */}
        <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6 w-full box-border animate-fade-in-up">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 w-full box-border border-b border-slate-200/60 dark:border-white/5 pb-6">
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                {selectedStory.title}
              </h1>
              <div className="flex flex-wrap gap-2 select-none">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                  🎭 {selectedStory.tag}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/5 text-purple-600 dark:text-purple-400 border border-purple-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                  🌐 {selectedStory.language || "English"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800/5 text-slate-600 dark:text-slate-400 border border-slate-700/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                  📖 {formatReadingStats(selectedStory.content)}
                </span>
                {selectedStory.emotions && selectedStory.emotions.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 py-1 px-3 text-xs font-bold uppercase tracking-wider shadow-sm">
                    😊 {selectedStory.emotions.join(", ")}"""

if bad_block in content:
    content = content.replace(bad_block, "")
    with open('frontend/src/components/stories/stories.view.component.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed bad block!")
else:
    print("Could not find the bad block exactly.")
