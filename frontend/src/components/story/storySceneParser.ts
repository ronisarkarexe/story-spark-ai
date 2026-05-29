export interface StoryScene {
  id: string;
  text: string;
  type: 'narration' | 'dialog';
}

export function parseStoryToScenes(content: string): StoryScene[] {
  if (!content) return [];
  
  const paragraphs = content.split(/\\n+/).filter(Boolean);
  const scenes: StoryScene[] = [];
  
  paragraphs.forEach((p, index) => {
    // Regex to split dialogs from narration
    const dialogRegex = /["“](.*?)["”](.*)/;
    const match = p.match(dialogRegex);
    
    if (match) {
      const beforeStr = p.substring(0, match.index).trim();
      if (beforeStr) {
         scenes.push({ id: `scene-${index}-n1`, text: beforeStr, type: 'narration' });
      }
      
      const dialogText = match[1].trim();
      scenes.push({ id: `scene-${index}-d`, text: dialogText, type: 'dialog' });
      
      const afterStr = match[2].trim();
      if (afterStr) {
         scenes.push({ id: `scene-${index}-n2`, text: afterStr, type: 'narration' });
      }
    } else {
      scenes.push({
        id: `scene-${index}`,
        text: p,
        type: 'narration'
      });
    }
  });

  return scenes;
}
