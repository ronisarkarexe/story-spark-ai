# Frontend Hooks API

This document describes the API surface of frontend React hooks in `frontend/src/hooks/`.

## useScrollDirection

Tracks the user's scroll direction and whether they are at the top of the page.

```typescript
import { useScrollDirection } from "../hooks/useScrollDirection";

const { scrollDirection, isAtTop } = useScrollDirection();
```

**Returns:**
- `scrollDirection: "up" | "down"` - Direction of the last scroll event
- `isAtTop: boolean` - True when `scrollY < 10`

**Side effects:**
- Registers a passive `scroll` event listener on `window`
- Cleans up the listener on component unmount

**Notes:**
- The hook uses `window.scrollY` (not `window.pageYOffset`) for scroll detection
- The `isAtTop` threshold is 10 pixels
- The hook uses `lastScrollY` in the effect dependency array; updates are scheduled but not synchronous

---

## useStoryMeta

Sets document title and Open Graph / Twitter Card meta tags for SEO and social sharing.

```typescript
import { useStoryMeta } from "../hooks/useStoryMeta";

useStoryMeta({
  title: "My Story Title",
  description?: "Story description for social previews",
  imageUrl?: "https://example.com/og-image.jpg",
});
```

**Props:**
- `title: string` (required) - Used for `<title>` and og:title / twitter:title
- `description?: string` - Sets og:description, twitter:description, and name="description"
- `imageUrl?: string` - Sets og:image and twitter:image

**Side effects:**
- Mutates `document.title` and `meta[property/content]` elements in `<head>`
- Runs on every render when props change

**Selector targets:**
| Meta tag | Attribute |
|---|---|
| Description | `meta[name="description"]` |
| OG description | `meta[property="og:description"]` |
| Twitter description | `meta[name="twitter:description"]` |
| OG title | `meta[property="og:title"]` |
| Twitter title | `meta[name="twitter:title"]` |
| OG image | `meta[property="og:image"]` |
| Twitter image | `meta[name="twitter:image"]` |

---

## useWritingMetrics

Tracks writing metrics for the story prompt form (prompt length and time-to-submit).

```typescript
import { useWritingMetrics } from "../hooks/useWritingMetrics";

// Access via the returned ref and functions
const metricsRef = useWritingMetrics();
```

**Returns:**
- A ref or object containing prompt length and timing data (implementation detail: useRef-based)

**Side effects:**
- Tracks `input` events on elements with `data-prompt-target` attribute
- Tracks form submission event to measure time-to-submit

---

## useRecentPrompts

Manages a localStorage-persisted history of recent story prompts.

```typescript
import { useRecentPrompts } from "../hooks/useRecentPrompts";

const { prompts, addPrompt, clearPrompts } = useRecentPrompts();
```

**Returns:**
- `prompts: IRecentPrompt[]` - Array of recent prompts
- `addPrompt(prompt: string): void` - Adds a prompt to history
- `clearPrompts(): void` - Clears all recent prompts

**Storage:**
- Persisted in localStorage under a prefixed key
- Maximum history size is implementation-defined (check source for limit)

**Interface `IRecentPrompt`:**
```typescript
interface IRecentPrompt {
  id: string;
  prompt: string;
  // additional fields (check source)
}
```

---

## useCollaboration

Manages real-time collaborative editing via Socket.IO.

```typescript
import { useCollaboration } from "../hooks/useCollaboration";

const {
  participants,
  storyChunks,
  isConnected,
  emitChunk,
  disconnect,
} = useCollaboration(storyId, token);
```

**Parameters:**
- `storyId: string` - The story session to join
- `token: string` - Auth token for socket authentication

**Returns:**
- `participants: Participant[]` - Active collaborators in the session
- `storyChunks: StoryChunk[]` - Collaborative text chunks received from other users
- `isConnected: boolean` - Socket connection state
- `emitChunk(chunk: StoryChunk): void` - Emit a text chunk to collaborators
- `disconnect(): void` - Manually disconnect from the socket

**Notes:**
- Connects to the Socket.IO server resolved via `resolveSocketUrl`
- Handles participant join/leave events
- Cleans up socket on unmount

---

## useVoiceFavorites

Manages a localStorage-persisted list of favorite AI voices.

```typescript
import { useVoiceFavorites } from "../hooks/useVoiceFavorites";

const { favorites, toggleFavorite, isFavorite } = useVoiceFavorites();
```

**Returns:**
- `favorites: string[]` - Array of favorite voice IDs
- `toggleFavorite(voiceId: string): void` - Add or remove a voice from favorites
- `isFavorite(voiceId: string): boolean` - Check if a voice is favorited

**Storage:**
- Key: `storysparkAI_favoriteVoices` in localStorage
