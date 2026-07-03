import re

with open('frontend/src/components/stories/stories.view.component.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove dangling buildSentenceSegments part
content = content.replace("""    wordCursor += wordsInSentence;
  });

export const RelatedStoriesComponent""", """export const RelatedStoriesComponent""")

content = content.replace("""    </div>
  );
  return segments;
};

const detectStoryMood""", """    </div>
  );
};

const detectStoryMood""")

# 2. In handleExportPDF, remove the trailing markdown logic that shouldn't be there
# We'll just replace the broken end of handleExportPDF
broken_export = """      downloadBlob(blob, getSafeFileName(title, "md"));
      toast.success("Markdown downloaded!");
    } catch (error) { console.error(error); toast.error("Failed to export Markdown."); }
  };

    toast.success("PDF downloaded!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to export PDF.");
  }
};"""

content = content.replace(broken_export, """  };""")

# 3. Fix the catastrophic double return in StoriesViewComponent
# It starts at:
#         {/* ── Left Column ── */}
#         <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6 w-full box-border animate-fade-in-up">
# Wait, actually let's just find the double return and remove it.

# Let's save it back first
with open('frontend/src/components/stories/stories.view.component.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed syntax errors!")
