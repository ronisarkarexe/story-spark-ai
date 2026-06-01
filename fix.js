const fs = require('fs');

function replaceAll(file, search, replace) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(file, content);
  }
}

// 1. AudioPlayer.tsx
let file = 'frontend/src/components/AudioPlayer.tsx';
if(fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const speech: any = useSpeechSynthesis\(text, voiceGender\);\r?\n\s*const speech: any = useSpeechSynthesis\(text\);/g, 'const speech = useSpeechSynthesis(text) as unknown as any;');
  content = content.replace(/const speech: any = useSpeechSynthesis\(text\);/g, 'const speech = useSpeechSynthesis(text) as unknown as any;');
  content = content.replace(/\(speech as any\)/g, 'speech');
  fs.writeFileSync(file, content);
}

// 2. Chat.tsx
replaceAll('frontend/src/components/chat/Chat.tsx', /message: any/g, 'message: unknown');

// 3. profile.setting.component.tsx
replaceAll('frontend/src/components/dashboard/profile/profile.setting.component.tsx', /\"use client\";\r?\n?/g, '');

// 4. community_spotlight.component.tsx
replaceAll('frontend/src/components/home/community_spotlight/community_spotlight.component.tsx', /\/\* eslint-disable.*?\*\/\r?\n/g, '');

// 5. feature.component.tsx
replaceAll('frontend/src/components/home/feature/feature.component.tsx', /\/\* eslint-disable.*?\*\/\r?\n/g, '');

// 6. post.feature.component.tsx
replaceAll('frontend/src/components/post/post.feature.component.tsx', /import LoadingAnimation from '\.\.\/\.\.\/hooks\/loading';\r?\n/g, '');

// 7. related.stories.view.component.tsx
replaceAll('frontend/src/components/post/related.stories.view.component.tsx', /\"use client\";\r?\n?/g, '');

// 8. story_inspiration_card.component.tsx
replaceAll('frontend/src/components/story-inspiration/story_inspiration_card.component.tsx', /\"use client\";\r?\n?/g, '');

// 9. ss-input.tsx
replaceAll('frontend/src/components/ui-component/ss-input/ss-input.tsx', /autoFocus,/g, '');

// 10. ss-profile.tsx
replaceAll('frontend/src/components/ui-component/ss-profile/ss-profile.tsx', /\"use client\";\r?\n?/g, '');

// 11. user.api.ts
replaceAll('frontend/src/redux/apis/user.api.ts', /import \{ tagTypes as baseTagTypes \} from '\.\/tagTypes';\r?\n/g, '');

console.log("Fixes applied successfully.");
