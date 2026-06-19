# Prompt Analysis Feature Integration Guide

## Overview
The AI Prompt Enhancement & Creativity Score System provides users with detailed analysis of their story prompts before generation, including:
- **Creativity Score (0-100)**: Machine learning-based creativity assessment
- **Enhanced Prompt**: AI-refined version of the original prompt
- **Improvement Suggestions**: At least 3 specific actionable recommendations
- **Sentiment Analysis**: Emotional tone breakdown
- **Keyword Extraction**: Automatically identified key themes
- **Complexity Assessment**: Prompt complexity classification

## Components

### 1. **PromptAnalysisCard** (Main Component)
The complete interactive analysis interface with all features.

```tsx
import { PromptAnalysisCard } from "@/components/prompt_analysis";

<PromptAnalysisCard
  prompt={userPrompt}
  language="English"
  genre="Fantasy"
  tone="mysterious"
  onUseEnhanced={(enhanced) => setPrompt(enhanced)}
  autoAnalyze={false}
/>
```

### 2. **PromptAnalysisIntegration** (Collapsible Wrapper)
Ready-to-use wrapper for story generation pages with collapse/expand functionality.

```tsx
import PromptAnalysisIntegration from "@/components/prompt_analysis/PromptAnalysisIntegration";

<PromptAnalysisIntegration
  prompt={textareaValue}
  language={selectedLanguage}
  genre={selectedGenre}
  tone={selectedTone}
  onUseEnhanced={handleUseEnhanced}
  defaultExpanded={false}
/>
```

### 3. Sub-Components (Can be used independently)
- **CreativityScoreCard**: Displays the creativity score with visualization
- **EnhancedPromptCard**: Shows enhanced prompt with copy/use actions
- **PromptSuggestionsCard**: Lists improvements and recommendations

## Integration into Story Generation

### Step 1: Import the Integration Component
```tsx
// In stories.component.tsx
import PromptAnalysisIntegration from "@/components/prompt_analysis/PromptAnalysisIntegration";
```

### Step 2: Add Handler for Enhanced Prompts
```tsx
const handleUseEnhancedPrompt = (enhancedPrompt: string) => {
  setTextareaValue(enhancedPrompt);
  // Optional: Trigger analysis or auto-generation
  toast.success("Using enhanced prompt for generation");
};
```

### Step 3: Insert Before Story Form
```tsx
// Add this in the render section, AFTER the prompt textarea and BEFORE the generation button
<>
  {/* Existing prompt textarea */}
  <textarea
    ref={inputRef}
    value={textareaValue}
    onChange={(e) => setTextareaValue(e.target.value)}
    className="..."
  />

  {/* NEW: Prompt Analysis Integration */}
  <PromptAnalysisIntegration
    prompt={textareaValue}
    language={selectedLanguage}
    genre={selectedGenre}
    tone={selectedTone}
    onUseEnhanced={handleUseEnhancedPrompt}
    defaultExpanded={false}
  />

  {/* Existing generation button and options */}
  <button onClick={handleGenerate}>Generate Story</button>
</>
```

## API Endpoints

### Analyze Prompt
```
POST /api/v1/prompt-analysis/analyze
Content-Type: application/json

{
  "prompt": "A young wizard discovers a hidden library...",
  "language": "English",
  "genre": "Fantasy",
  "tone": "mysterious"
}
```

**Response:**
```json
{
  "prompt": "A young wizard discovers a hidden library...",
  "creativityScore": 78,
  "enhancedPrompt": "A gifted young wizard stumbles upon an enchanted, centuries-old library...",
  "improvements": ["Add character name", "Specify time period", "Define central conflict"],
  "keywords": ["wizard", "library", "magic", "discovery"],
  "promptLength": 45,
  "estimatedGenerationTime": 12,
  "sentimentScore": {
    "positive": 0.65,
    "neutral": 0.25,
    "negative": 0.10
  },
  "complexity": "moderate",
  "recommendations": [
    {
      "title": "Add Character Details",
      "description": "Include the wizard's name, age, or specific abilities for better character development.",
      "impact": "high"
    }
  ]
}
```

### Enhance Prompt (Simplified)
```
POST /api/v1/prompt-analysis/enhance
```
Returns only: originalPrompt, enhancedPrompt, improvements, keywords

### Batch Analyze
```
POST /api/v1/prompt-analysis/batch
Content-Type: application/json

{
  "prompts": [
    { "prompt": "First prompt..." },
    { "prompt": "Second prompt..." }
  ]
}
```

## Frontend Service

```tsx
import { 
  analyzePrompt, 
  enhancePrompt,
  batchAnalyzePrompts,
  IPromptAnalysisResponse 
} from "@/services/prompt_analysis.service";

// Single analysis
const result = await analyzePrompt({
  prompt: "User's prompt",
  language: "English"
});

// Get enhanced version only
const enhanced = await enhancePrompt({ prompt: "..." });

// Batch processing
const results = await batchAnalyzePrompts([
  { prompt: "First" },
  { prompt: "Second" }
]);
```

## Features

### ✨ Creativity Score Calculation
- Based on prompt length, keyword diversity, sentiment balance, complexity
- Boosted by intrigue words and imaginative language
- Ranges from 0-100 with AI enhancement from Gemini API

### 🎯 Smart Suggestions
- Uses Gemini 1.5 Flash for intelligent recommendations
- Fallback suggestions if API unavailable
- Categorized by impact level (High/Medium/Low)

### 📊 Sentiment Analysis
- Positive, Neutral, Negative breakdown
- Helps users understand emotional tone
- Visual progress bars for easy interpretation

### 🔍 Keyword Extraction
- Automatic identification of key themes
- Stop words filtering
- Frequency-based ranking

### 📱 Responsive Design
- Mobile-first approach
- Works seamlessly on all screen sizes
- Touch-friendly interaction areas

## Mobile Responsiveness

All components use Tailwind CSS with responsive utilities:
- **Mobile (default)**: Single column layouts, stacked elements
- **SM (≥640px)**: Two-column grids where appropriate
- **MD+ (≥768px)**: Full-width grids and layouts

## Error Handling

The system includes comprehensive error handling:
- Network failures → Graceful fallback suggestions
- API timeouts → User-friendly error messages
- Invalid input → Validation feedback
- Retry mechanisms → Toast notifications

## Performance Considerations

- Debounced API calls to prevent excessive requests
- Lazy loading of analysis components
- Optimized animations with Framer Motion
- Minimal re-renders with proper memoization

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Color contrast compliant
- Focus indicators on all buttons
- Error messages clearly associated with inputs

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- **React 19+**
- **framer-motion**: For animations
- **lucide-react**: For icons
- **react-hot-toast**: For notifications
- **@google/generative-ai**: For Gemini API
- **axios**: For API calls
- **Tailwind CSS**: For styling

## Troubleshooting

### Analysis takes too long
- Increase timeout in backend service (currently 60 seconds)
- Check API rate limits
- Verify Gemini API key configuration

### Enhanced prompt looks same as original
- This can happen if the prompt is already well-crafted
- Review suggestions instead for specific improvements
- Consider the creativity score feedback

### Missing keywords
- Ensure prompt is at least 10 characters
- Check for valid words (numbers-only prompts may have fewer keywords)
- Review the text for clarity

## Future Enhancements

- [ ] User preference learning for personalized scores
- [ ] Historical analysis trends and improvements
- [ ] Community benchmark comparisons
- [ ] Custom creativity scoring algorithms
- [ ] Multi-language sentiment analysis improvements
- [ ] Prompt templates based on creativity scores

## Support

For issues or suggestions, please refer to the main project documentation or create an issue in the repository.
