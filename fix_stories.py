import re

with open('frontend/src/components/stories/stories.component.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# First fix the AudioPlayer break at line 1675
# The broken block is:
broken_audio_player = """                    <div className="flex items-center gap-2" ref={languageDropdownRef}>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">🌐 {text.language}:</span>
                      <div className="relative">
            <div className="relative z-10 mt-6">
              <AudioPlayer"""

fixed_audio_player = """            <div className="relative z-10 mt-6">
              <AudioPlayer"""

if broken_audio_player in content:
    content = content.replace(broken_audio_player, fixed_audio_player)
    print("Fixed AudioPlayer break.")
else:
    print("Could not find AudioPlayer break.")

# Now fix the main huge broken block from 1718 to 2159
# Start marker:
start_marker = """              <div className="flex flex-wrap gap-2">
                {selectedStory ? (
                  <>
                    {topics.map((topic, index) => ("""

# End marker (the trailing part of the language dropdown at 2154)
end_marker = """                </li>
              ))}
            </ul>
          )}
        </div>
      </div>"""

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    end_idx += len(end_marker)
    
    # Replacement block
    replacement = """              <div className="flex flex-wrap gap-2">
                {selectedStory ? (
                  <>
                    {topics.map((topic, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 ${topic.className} rounded-full text-sm font-medium transition-transform hover:scale-105 shadow-sm`}
                      >
                        <button
                          type="button"
                          className="cursor-pointer"
                          onClick={() => handleTopicClick(index)}
                        >
                          {topic.selected ? (
                            <i className="fa-solid fa-check"></i>
                          ) : (
                            <i className="fa-solid fa-plus"></i>
                          )}{" "}
                          {topic.title}
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer border-l border-current/30 pl-2 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => handleRemoveTopic(index)}
                          disabled={topics.length <= 2}
                          aria-label={`Remove ${topic.title}`}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </span>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 w-full text-center">
                    <p className="text-slate-500">Please select a story style or template above.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-200">
                  Write Your Prompt
                </h3>
                
                <div className="flex items-center gap-2" ref={languageDropdownRef}>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">🌐 {text.language}:</span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm focus:ring-2 focus:ring-blue-500/30"
                    >
                      <span>{LANGUAGES.find(l => l.name === selectedLanguage)?.name || "English"}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-[9px]">▼</span>
                    </button>

                    {isLanguageDropdownOpen && (
                      <ul className="absolute right-0 z-20 mt-1.5 max-h-48 w-40 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl focus:outline-none divide-y divide-slate-100 dark:divide-white/5 p-1 box-border list-none m-0">
                        {LANGUAGES.map((lang) => (
                          <li key={lang.code} className="p-0 m-0 list-none">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLanguage(lang.name);
                                setIsLanguageDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors duration-150 cursor-pointer ${
                                selectedLanguage === lang.name
                                  ? "bg-blue-600 text-white font-bold"
                                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              {lang.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl p-4 transition-all focus-within:border-blue-500/30 focus-within:bg-white dark:focus-within:bg-[#111827]/20 w-full box-border">
                <textarea
                  {...register("prompt")}
                  ref={(el) => {
                    register("prompt").ref(el);
                    inputRef.current = el;
                  }}
                  className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-slate-800 dark:text-slate-200 focus:ring-0 text-sm sm:text-base leading-relaxed placeholder:italic placeholder:text-slate-400 dark:placeholder:text-slate-500 pr-12 transition-colors duration-200 ${
                    isOverLimit || isDangerLimit ? "ring-1 ring-red-500 rounded-lg p-2" : isNearLimit ? "ring-1 ring-yellow-400 rounded-lg p-2" : ""
                  }`}
                  placeholder={text.promptPlaceholder}
                  value={textareaValue}
                  maxLength={MAX_PROMPT_LENGTH}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      handleNextStep();
                      return;
                    }

                    const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC");
                    const shouldTrigger = isMac ? e.metaKey : e.ctrlKey;

                    if (e.key === "Enter" && shouldTrigger && !e.shiftKey && !loading && !isOverLimit && textareaValue.trim().length > 0) {
                      e.preventDefault();
                      if (isGenerationInProgressRef.current) return;
                      handleGenerateClick();
                    }
                  }}
                />

                <div className="absolute right-3.5 top-3.5 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsRecentPromptsOpen(!isRecentPromptsOpen)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-500 transition-colors duration-150 cursor-pointer"
                    aria-label={text.recentPrompts}
                    title={text.recentPrompts}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/40 dark:border-white/5 select-none w-full box-border">
                  <div className="flex-1 min-w-0 pr-4">
                    {isOverLimit ? (
                      <p className="text-[11px] font-semibold text-red-500 dark:text-red-400 flex items-center gap-1 truncate m-0">
                        <span>⚠️</span> {text.characterLimit}
                      </p>
                    ) : isNearLimit ? (
                      <p className="text-[11px] font-semibold text-amber-500 dark:text-amber-400 flex items-center gap-1 truncate m-0">
                        <span>⚠️</span> {MAX_PROMPT_LENGTH - textareaValue.length} {text.charactersRemaining}
                      </p>
                    ) : null}
                  </div>

                  <span className={`text-[11px] font-bold tabular-nums shrink-0 ml-auto ${
                    isOverLimit || isDangerLimit ? "text-red-500 dark:text-red-400" : isNearLimit ? "text-amber-500" : "text-slate-400"
                  }`}>
                    {textareaValue.length} / {MAX_PROMPT_LENGTH}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-medium leading-relaxed text-slate-400 dark:text-slate-500 select-none w-full box-border">
                💡 <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">{text.keyboardTip}</span>
                {text.press} <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Enter</kbd> to continue •{" "}
                Press <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">{typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC") ? "Cmd" : "Ctrl"} + Enter</kbd> to generate •{" "}
                <kbd className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md text-slate-700 dark:text-slate-300 mx-0.5 shadow-sm">Shift + Enter</kbd> {text.forNewLine}
              </div>

              <div className="flex justify-end pt-2 w-full box-border mt-4">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 active:scale-[0.98] select-none uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Next: Cast of Characters ➡️</span>
                </button>
              </div>"""
    
    content = content[:start_idx] + replacement + content[end_idx:]
    print("Fixed the huge broken block.")
else:
    print("Could not find the huge broken block markers.")

with open('frontend/src/components/stories/stories.component.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
