# Chapter Illustration Feature Guide

## Overview

The **Chapter Illustration** feature integrates AI image generation to automatically create custom illustrations for story chapters. This feature uses OpenAI DALL-E 3 or Stability AI APIs to generate unique, consistent chapter artwork based on chapter content and styling preferences.

## Features

- ✨ **AI-Powered Generation**: Uses DALL-E 3 or Stability AI for high-quality image generation
- 💾 **Smart Caching**: Caches generated images for 30 days to avoid redundant API calls
- 🎨 **Style Customization**: Multiple art styles (realistic, illustration, cartoon, watercolor, sketch)
- 📊 **Batch Generation**: Generate illustrations for multiple chapters simultaneously
- ⏱️ **Async Processing**: Non-blocking background generation to avoid delaying chapter creation
- 🔒 **Access Control**: Rate limiting and user authentication for safe API usage
- 🚨 **Error Handling**: Graceful fallback mechanisms when generation fails
- 🔄 **Automatic Cleanup**: TTL-based cache cleanup for expired entries

## Installation

### 1. Environment Configuration

Add the following to your `.env` file:

```env
# Image Generation Provider (openai or stability)
IMAGE_GENERATION_PROVIDER=openai

# API Key for image generation
IMAGE_GENERATION_API_KEY=your_api_key_here

# Optional: OpenAI API key (used as fallback if IMAGE_GENERATION_API_KEY is not set)
OPEN_AI_KEY=your_openai_key_here

# Optional: Stability AI API key
STABILITY_AI_API_KEY=your_stability_key_here
```

### 2. Database Setup

The feature automatically creates the required MongoDB collection for image caching:

```typescript
// The ImageCacheModel is auto-created when the module loads
// It includes a TTL index for automatic cache expiration
```

### 3. Dependencies

All required dependencies are already included in `package.json`:
- `openai` - For DALL-E API access
- `mongoose` - For cache management
- `express-rate-limit` - For rate limiting

## API Endpoints

### Generate Single Chapter Illustration

**Endpoint**: `POST /api/v1/chapter-illustrations/generate`

**Authentication**: Required (USER, WRITER, ADMIN, SUPER_ADMIN)

**Rate Limit**: 50 requests per hour per user

**Request Body**:
```json
{
  "chapterId": "chapter_123",
  "chapterTitle": "The Adventure Begins",
  "chapterContent": "Once upon a time, in a mystical kingdom...",
  "storyContext": "A fantasy adventure story set in a magical realm",
  "imagePrompt": "Optional custom image prompt for more control",
  "style": "illustration",
  "quality": "standard"
}
```

**Parameters**:
- `chapterId` (required): Unique identifier for the chapter
- `chapterTitle` (required): Title of the chapter (max 500 chars)
- `chapterContent` (required): Chapter content for context (10-10000 chars)
- `storyContext` (optional): Additional story context (max 2000 chars)
- `imagePrompt` (optional): Custom image prompt to override auto-generation
- `style` (optional): Art style - `realistic|illustration|cartoon|watercolor|sketch` (default: illustration)
- `quality` (optional): Quality level - `standard|hd` (default: standard)

**Response**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Chapter illustration generated successfully",
  "data": {
    "chapterId": "chapter_123",
    "imageUrl": "https://example.com/image.png",
    "imageStatus": "generated",
    "generatedAt": "2026-01-15T10:30:00Z",
    "cacheKey": "abc123def456..."
  }
}
```

**Status Codes**:
- `200`: Illustration successfully generated
- `202`: Partial success (some illustrations failed in batch)
- `206`: Generation failed but request was valid (partial content)
- `429`: Rate limit exceeded
- `401`: Unauthorized
- `400`: Invalid request

### Generate Batch Illustrations

**Endpoint**: `POST /api/v1/chapter-illustrations/batch`

**Authentication**: Required (USER, WRITER, ADMIN, SUPER_ADMIN)

**Rate Limit**: 50 requests per hour per user

**Request Body**:
```json
{
  "chapters": [
    {
      "chapterId": "ch_1",
      "chapterTitle": "Chapter 1",
      "chapterContent": "Content for chapter 1...",
      "storyContext": "Optional context"
    },
    {
      "chapterId": "ch_2",
      "chapterTitle": "Chapter 2",
      "chapterContent": "Content for chapter 2...",
      "storyContext": "Optional context"
    }
  ],
  "style": "illustration",
  "quality": "standard"
}
```

**Response**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Generated 2 of 2 chapter illustrations",
  "data": {
    "total": 2,
    "successful": 2,
    "failed": 0,
    "illustrations": [
      {
        "chapterId": "ch_1",
        "imageUrl": "https://example.com/image1.png",
        "imageStatus": "generated",
        "generatedAt": "2026-01-15T10:30:00Z"
      },
      {
        "chapterId": "ch_2",
        "imageUrl": "https://example.com/image2.png",
        "imageStatus": "cached",
        "generatedAt": "2026-01-15T10:31:00Z"
      }
    ]
  }
}
```

### Clear Expired Cache

**Endpoint**: `DELETE /api/v1/chapter-illustrations/cache`

**Authentication**: Required (ADMIN, SUPER_ADMIN)

**Response**:
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Cleared 5 expired cache entries",
  "data": {
    "deletedCount": 5
  }
}
```

## Usage Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

// Generate single illustration
async function generateChapterIllustration() {
  try {
    const response = await axios.post(
      '/api/v1/chapter-illustrations/generate',
      {
        chapterId: 'ch_001',
        chapterTitle: 'The First Meeting',
        chapterContent: 'The hero meets their guide...',
        style: 'illustration',
        quality: 'hd'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('Illustration URL:', response.data.data.imageUrl);
  } catch (error) {
    console.error('Failed to generate illustration:', error.response.data);
  }
}

// Generate batch illustrations
async function generateBatchIllustrations(chapters) {
  try {
    const response = await axios.post(
      '/api/v1/chapter-illustrations/batch',
      {
        chapters,
        style: 'illustration',
        quality: 'standard'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const illustrations = response.data.data.illustrations;
    illustrations.forEach(ill => {
      console.log(`Chapter ${ill.chapterId}: ${ill.imageUrl}`);
    });
  } catch (error) {
    console.error('Batch generation failed:', error);
  }
}
```

### Integration with Chapter Creation

```typescript
import { generateIllustrationForChapter } from './chapter_illustration.integration';

// When creating a new chapter
async function createChapterWithIllustration(chapterData) {
  // Create the chapter first
  const chapter = await saveChapter(chapterData);

  // Generate illustration in background (non-blocking)
  generateIllustrationForChapter({
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    chapterContent: chapter.content,
    storyContext: chapter.storyContext,
    style: 'illustration',
    quality: 'standard'
  });

  return chapter;
}
```

## Configuration

### Provider Setup

#### OpenAI DALL-E 3

1. Get API key from [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. Add to `.env`:
```env
IMAGE_GENERATION_PROVIDER=openai
IMAGE_GENERATION_API_KEY=sk-...
```

**Costs**: ~$0.04 per 1024x1024 image

#### Stability AI

1. Get API key from [Stability AI Dashboard](https://platform.stability.ai/account/dashboard)
2. Add to `.env`:
```env
IMAGE_GENERATION_PROVIDER=stability
STABILITY_AI_API_KEY=sk-...
```

**Costs**: Varies by model and image size

### Rate Limiting

Current limits per user per hour:
- **Single Generation**: 50 requests
- **Batch Generation**: 50 requests

Adjust in `chapter_illustration.router.ts`:
```typescript
const imageGenerationLimiter = rateLimit({
  max: 50, // Change this value
});
```

### Cache Management

Cache configuration in `chapter_illustration.service.ts`:
```typescript
const CACHE_TTL_DAYS = 30; // Change to desired TTL in days
```

## Performance Optimization

### Caching Strategy

The service implements a multi-level caching strategy:

1. **Request-level Cache**: Check cache before API call
2. **Database Cache**: Store generated images with SHA-256 hash keys
3. **Automatic Cleanup**: TTL-based indexes remove expired entries

### Batch Processing

For batch operations:
- Generates illustrations sequentially (not parallel) to avoid rate limiting
- Includes 1-second delays between requests
- Can be extended with task queues for production

### Best Practices

1. **Always provide `chapterContent`**: Better context = better illustrations
2. **Use specific `style` choices**: Consistency across chapters
3. **Implement retry logic**: Network failures are possible
4. **Monitor API costs**: Set up billing alerts with your provider
5. **Use batch endpoints**: More efficient for multiple chapters

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 429 Too Many Requests | Rate limit exceeded | Wait before making new requests |
| 401 Unauthorized | Invalid API key | Verify `IMAGE_GENERATION_API_KEY` in `.env` |
| 503 Service Unavailable | API provider down | Retry after a delay |
| 400 Bad Request | Invalid prompt length | Keep chapter content under 10000 chars |

### Fallback Mechanisms

If image generation fails:
1. Request doesn't block chapter creation
2. User can retry generation later
3. Cache is checked on retry attempts
4. Default fallback images can be implemented at frontend

## Testing

Run the test suite:

```bash
# Unit tests
npm run test -- chapter_illustration.service.test.ts

# Integration tests
npm run test -- chapter_illustration

# Test with real API (set API_KEY in .env.test)
npm run test:integration
```

## Troubleshooting

### Images not generating

1. **Check API key**: Verify `IMAGE_GENERATION_API_KEY` is set
2. **Check provider**: Ensure `IMAGE_GENERATION_PROVIDER` is correct
3. **Check rate limits**: Verify you haven't hit hourly limits
4. **Check logs**: Look for detailed error messages in server logs

### High API costs

1. Implement stricter rate limits
2. Increase cache TTL to reuse images longer
3. Use `quality: "standard"` instead of "hd"
4. Filter out redundant requests

### Slow generation

1. Use batch endpoints instead of sequential calls
2. Implement task queue for background processing
3. Consider quality settings impact
4. Use cached results when available

## Future Enhancements

- [ ] Task queue integration for background processing
- [ ] Multiple AI provider support (Google Vertex AI, etc.)
- [ ] Image upscaling/enhancement options
- [ ] Style templates for story genres
- [ ] Image editing/refinement workflows
- [ ] Analytics dashboard for generation metrics
- [ ] Fallback image service
- [ ] Image storage in CDN/cloud storage

## Security Considerations

### API Key Protection

- ⚠️ **NEVER** commit `.env` files with API keys
- Use environment variables in production
- Rotate keys periodically
- Use separate keys for development/production

### Request Validation

- All inputs are validated against Zod schemas
- Prompt length limited to prevent API issues
- Chapter content size restricted to reasonable limits
- Authentication required for all endpoints

### Rate Limiting

- Per-user rate limiting to prevent abuse
- Global rate limiting as fallback
- Cache prevents redundant expensive API calls

## Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review error logs in server console
3. Open an issue on [GitHub](https://github.com/ronisarkarexe/story-spark-ai)
4. Contact maintainers with detailed error information

## License

This feature is part of Story Spark AI and follows the same MIT license.
