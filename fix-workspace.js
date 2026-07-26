
const fs = require("fs");
let code = fs.readFileSync("frontend/src/components/story/StoryWorkspace.tsx", "utf8");

code = code.replace("import StoryReadingAnalytics from \"../analytics/StoryReadingAnalytics\";\n", "");
code = code.replace(/<StoryReadingAnalytics[\s\S]*?\/>/g, "");
code = code.replace(/<VocabularyAnalyzer[\s\S]*?\/>/g, "");
code = code.replace(/theme: selectedTheme,/g, "");
code = code.replace("<CharacterNetwork storyId={currentStory.id} />", "<CharacterNetwork storyId={currentStory.id} storyContent={currentStory.chapters?.map(c => c.content).join(\"\\n\\n\") || \"\"} />");

fs.writeFileSync("frontend/src/components/story/StoryWorkspace.tsx", code);

