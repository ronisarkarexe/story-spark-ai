# Time Formatting Utilities

The time formatting utilities (`frontend/src/utils/time-formate.ts`) provide functions for converting timestamps and date strings into human-readable formats. These are used throughout the app for displaying relative timestamps (e.g., "2 hours ago") and formatted dates.

## Functions

### getISTTimeFormate

Formats a Unix timestamp (seconds since epoch) into a localized time string in IST (India Standard Time) timezone.

```typescript
import { getISTTimeFormate } from "../utils/time-formate";

const timestamp = Math.floor(Date.now() / 1000);
const formatted = getISTTimeFormate(timestamp);
// e.g. "04:09:06 PM UTC" (in container environment)
// e.g. "04:39:06 PM IST" (in IST-aware environment)
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `expiredAt` | `number` | Unix timestamp in seconds since epoch |

**Returns:** `string` — A formatted time string using `Intl.DateTimeFormat` with hour, minute, second, and timezone abbreviation.

---

### timeAgo

Converts an ISO date string into a human-readable relative time description (e.g., "2 hours ago"). Handles years, months, days, hours, minutes, and seconds. Returns "just now" for future timestamps.

```typescript
import { timeAgo } from "../utils/time-formate";

// A story published 3 days ago
const result = timeAgo("2024-06-10T12:00:00.000Z");
// "3 days ago"

// A very recent update
const recent = timeAgo(new Date(Date.now() - 5000).toISOString());
// "5 seconds ago"

// A timestamp far in the future
const future = timeAgo(new Date(Date.now() + 1000000).toISOString());
// "just now"
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `dateString` | `string` | An ISO 8601 date string (e.g., from `Date.toISOString()`) |

**Returns:** `string` — One of: `"just now"`, `"N seconds ago"`, `"1 second ago"`, `"N minutes ago"`, `"1 minute ago"`, `"N hours ago"`, `"1 hour ago"`, `"N days ago"`, `"1 day ago"`, `"N months ago"`, `"1 month ago"`, `"N years ago"`, `"1 year ago"`.

**Edge cases:**
- Future timestamps return `"just now"` (handles clock skew)
- Exactly 1 of any unit uses the singular form ("1 day ago" not "1 days ago")
- Plural forms are used for all other quantities

---

### formatDateShort

Formats an ISO date string into a short human-readable date (e.g., "Jan 15, 2024").

```typescript
import { formatDateShort } from "../utils/time-formate";

const result = formatDateShort("2024-01-15");
// "Jan 15, 2024"

const withTime = formatDateShort("2024-06-20T12:30:00.000Z");
// "Jun 20, 2024"
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `dateString` | `string` | An ISO 8601 date string |

**Returns:** `string` — A date string in `"Mon DD, YYYY"` format using `toLocaleDateString` with `en-US` locale.

## Common Usage

These utilities are typically used in story and post components to display publication dates, reading history timestamps, and session activity times.

```typescript
// Display when a story was last updated
const updatedAt = timeAgo(story.updatedAt);
// "3 hours ago"

// Display session expiry time
const expiresAt = getISTTimeFormate(session.expiresAt);
// "02:30:45 PM IST"

// Display a formatted publication date
const publishedDate = formatDateShort(story.publishedAt);
// "Jun 20, 2024"
```
