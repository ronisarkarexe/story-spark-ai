# Prompt Analysis API Documentation

## Base URL
```
/api/v1/prompt-analysis
```

## Endpoints

### 1. Analyze Prompt
Comprehensive analysis of a story prompt including creativity score, enhancements, and recommendations.

**Endpoint:** `POST /api/v1/prompt-analysis/analyze`

**Request:**
```json
{
  "prompt": "A young wizard discovers a hidden library containing spells of forgotten ages. Confused and curious, she must choose between revealing her secret or protecting it.",
  "language": "English",
  "genre": "Fantasy",
  "tone": "mysterious"
}
```

**Query Parameters:** None

**Headers Required:**
- `Content-Type: application/json`

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Story prompt (10-2000 characters) |
| `language` | string | No | Language code. Default: "English" |
| `genre` | string | No | Genre classification |
| `tone` | string | No | Desired tone for the story |

**Valid Values:**
- **language**: English, Hindi, Spanish, French, Portuguese, German, Japanese, Korean, Bengali, Tamil, Telugu, Marathi
- **genre**: Drama, Comedy, Horror, Romance, Sci-Fi, Fantasy, Mystery, Adventure
- **tone**: formal, casual, humorous, serious, mysterious, inspirational

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Prompt analysis completed successfully",
  "data": {
    "prompt": "A young wizard discovers a hidden library...",
    "creativityScore": 78,
    "enhancedPrompt": "A gifted young wizard stumbles upon an enchanted, centuries-old library filled with spells of forgotten ages. Torn between curiosity and caution, she must decide whether to reveal her extraordinary discovery or guard it as a precious secret.",
    "improvements": [
      "Include the wizard's name or background for deeper character connection",
      "Specify the time period or setting for better world-building context",
      "Define the stakes—what happens if her secret is revealed?"
    ],
    "keywords": ["wizard", "library", "magic", "discovery", "secret", "spells"],
    "promptLength": 127,
    "estimatedGenerationTime": 15,
    "sentimentScore": {
      "positive": 0.65,
      "neutral": 0.25,
      "negative": 0.10
    },
    "complexity": "moderate",
    "recommendations": [
      {
        "title": "Add Character Background",
        "description": "Including the wizard's name, age, origin, or what makes her special will enhance character development and reader connection.",
        "impact": "high"
      },
      {
        "title": "Specify the Setting",
        "description": "Add details about the time period (fantasy era, modern-day), location (hidden forest, abandoned tower), or magical realm to ground the story.",
        "impact": "high"
      },
      {
        "title": "Define Clear Stakes",
        "description": "Clarify what the wizard stands to lose if her secret is discovered, creating tension and urgency in the narrative.",
        "impact": "medium"
      }
    ]
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Prompt must be at least 10 characters",
  "errorMessages": [
    {
      "path": "body.prompt",
      "message": "Prompt must be at least 10 characters"
    }
  ]
}
```

---

### 2. Enhance Prompt
Quick enhancement endpoint that returns only the enhanced prompt and suggestions (without full analysis).

**Endpoint:** `POST /api/v1/prompt-analysis/enhance`

**Request:**
```json
{
  "prompt": "A young wizard discovers a hidden library",
  "language": "English"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Prompt enhanced successfully",
  "data": {
    "originalPrompt": "A young wizard discovers a hidden library",
    "enhancedPrompt": "A gifted young wizard stumbles upon an enchanted, centuries-old library brimming with arcane knowledge and forgotten spells...",
    "improvements": [
      "Add character name or background",
      "Include the time period and setting details",
      "Define the central conflict or mystery"
    ],
    "keywords": ["wizard", "library", "magic", "discovery"]
  }
}
```

---

### 3. Batch Analyze Prompts
Analyze multiple prompts in a single request (up to 10 prompts).

**Endpoint:** `POST /api/v1/prompt-analysis/batch`

**Request:**
```json
{
  "prompts": [
    {
      "prompt": "First prompt here...",
      "language": "English"
    },
    {
      "prompt": "Second prompt here...",
      "language": "Spanish"
    }
  ]
}
```

**Query Parameters:** None

**Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompts` | array | Yes | Array of prompt objects (1-10 items) |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Analyzed 2 prompts successfully",
  "data": [
    {
      "prompt": "First prompt here...",
      "creativityScore": 72,
      "enhancedPrompt": "...",
      "improvements": [...],
      "keywords": [...],
      ...
    },
    {
      "prompt": "Second prompt here...",
      "creativityScore": 68,
      "enhancedPrompt": "...",
      "improvements": [...],
      "keywords": [...],
      ...
    }
  ]
}
```

---

## Response Fields Explained

### `creativityScore` (0-100)
Machine learning-based creativity assessment calculated from:
- Prompt length (optimal range: 50-150 words)
- Keyword diversity and relevance
- Sentiment balance and emotional tone
- Complexity and structure
- Presence of intrigue and imaginative language

**Score Interpretation:**
- **75-100**: Excellent creativity, well-structured and highly engaging
- **50-74**: Good potential, could benefit from additional details
- **0-49**: Fair creativity, review suggestions for significant improvements

### `enhancedPrompt`
AI-refined version of the original prompt using Google Gemini API. Incorporates:
- Improved specificity and clarity
- Enhanced descriptive language
- Better narrative structure
- More engaging opening/hook

### `improvements` (Array of 3-5 strings)
Specific, actionable suggestions to improve the prompt. Examples:
- "Add character names and background details"
- "Specify the setting and time period"
- "Include the central conflict or mystery"
- "Define stakes and consequences"

### `keywords` (Array of strings)
Automatically extracted important words/themes using:
- Stop word filtering
- Frequency analysis
- Semantic relevance scoring
- Limited to top 10 keywords

### `sentimentScore`
Emotional tone breakdown (all values between 0-1):
- **positive**: Uplifting, optimistic, joyful language
- **neutral**: Factual, descriptive, balanced language
- **negative**: Dark, threatening, somber language

### `complexity`
Prompt complexity classification:
- **simple**: Short, straightforward prompt (optimal for beginners)
- **moderate**: Balanced complexity with good detail (most prompts)
- **complex**: Sophisticated structure with nuanced elements (advanced users)

### `recommendations`
Array of detailed improvement suggestions with:
- **title**: Brief recommendation title
- **description**: Detailed explanation and benefits
- **impact**: "high", "medium", or "low" - expected impact on story quality

---

## Error Handling

### HTTP Status Codes

| Code | Scenario |
|------|----------|
| 200 | Successful analysis |
| 400 | Invalid request parameters (validation failed) |
| 422 | Prompt too short or too long |
| 500 | Internal server error |
| 503 | Gemini API unavailable (falls back to basic analysis) |

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errorMessages": [
    {
      "path": "body.prompt",
      "message": "Specific validation error"
    }
  ]
}
```

---

## Rate Limiting

The prompt analysis endpoints are subject to standard API rate limiting:
- **Default limit**: 100 requests per 15 minutes per IP
- **Batch limit**: 10 prompts maximum per request
- **Timeout**: 60 seconds per request

When rate limit is exceeded:
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

---

## Examples

### cURL Example
```bash
curl -X POST http://localhost:4002/api/v1/prompt-analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A time-traveler accidentally changes the past. Now she must fix history before anyone notices.",
    "language": "English",
    "genre": "Sci-Fi",
    "tone": "serious"
  }'
```

### JavaScript/Fetch Example
```javascript
const result = await fetch('/api/v1/prompt-analysis/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "A young detective discovers her cold case partner is the criminal mastermind.",
    language: "English",
    genre: "Mystery"
  })
});

const data = await result.json();
console.log(`Creativity Score: ${data.data.creativityScore}`);
```

### Python Example
```python
import requests

response = requests.post(
    'http://localhost:4002/api/v1/prompt-analysis/analyze',
    json={
        'prompt': 'An immortal vampire finds love in a mortal human.',
        'language': 'English',
        'genre': 'Romance',
        'tone': 'mysterious'
    }
)

analysis = response.json()['data']
print(f"Score: {analysis['creativityScore']}")
print(f"Enhanced: {analysis['enhancedPrompt']}")
```

---

## Implementation Details

### Creativity Score Algorithm
1. **Base Score**: 50 points
2. **Length Bonus**: +15 points (50-150 words), +10 points (30-200 words)
3. **Keyword Diversity**: +2 points per unique keyword (max 15)
4. **Sentiment Balance**: +10 points (balanced), +5 points (somewhat balanced)
5. **Complexity Bonus**: +10 points (complex), +5 points (moderate)
6. **Intrigue Indicators**: +5 points (has ? or !), +5 points (intrigue words), +10 points (imaginative words)
7. **AI Enhancement Boost**: +15 points (from Gemini analysis)

### Fallback Behavior
If Gemini API is unavailable:
- Returns pre-built suggestions based on prompt analysis
- Reduces creativity score boost (5 instead of 15)
- Maintains all other analysis features
- Notifies user of limited enhancement

### Language Support
Automatic detection and handling for:
- English, Spanish, French, Portuguese, German
- Hindi, Bengali, Tamil, Telugu, Marathi
- Japanese, Korean

Multi-language support includes:
- Sentiment analysis adapted for language patterns
- Keyword extraction using language-specific stop words
- Genre/tone translations in responses

---

## Best Practices

### For Frontend Integration
1. Validate prompt locally before sending (min 10 chars)
2. Show loading state during analysis
3. Cache results if prompt hasn't changed
4. Handle 503 errors gracefully with fallback UI

### For Backend Usage
1. Implement request timeouts (60 seconds)
2. Monitor Gemini API usage for cost optimization
3. Log analysis requests for analytics
4. Implement circuit breaker for API failures

### For Performance
1. Batch analyze related prompts when possible
2. Debounce real-time analysis calls
3. Cache frequently analyzed prompts
4. Use enhanced endpoint for quick suggestions

---

## Troubleshooting

### "Gemini API unavailable"
- Check API key configuration
- Verify API quota hasn't been exceeded
- Check network connectivity
- Fallback suggestions will still be provided

### "Prompt must be at least 10 characters"
- Ensure prompt length >= 10 characters
- Remove leading/trailing whitespace
- Combine multiple short phrases if needed

### No keywords extracted
- Ensure prompt contains meaningful words
- Avoid purely numeric or symbolic content
- Check language setting matches prompt

---

## Future Enhancements

- [ ] Multi-turn enhancement refinement
- [ ] User feedback loop for score calibration
- [ ] Historical analysis tracking
- [ ] Genre-specific creativity metrics
- [ ] Community benchmark comparison
- [ ] Custom score weighting options

---

## Support & Feedback

For API issues, feature requests, or documentation improvements, please contact the development team or submit an issue in the repository.
