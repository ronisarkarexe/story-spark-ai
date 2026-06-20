# Story Variation Comparison Mode - Implementation Guide

## Overview
The Story Variation Comparison Mode allows users to compare two AI-generated story variations from the same story, visually highlighting differences (added, removed, and modified content).

---

## Files Created

### 1. `frontend/src/components/story-comparison/ComparisonMode.tsx`
**Purpose**: Main container component that orchestrates the entire comparison flow.

**Key Features**:
- Manages comparison state (version selection, viewing mode)
- Handles transitions between selection and comparison views
- Loads versions and passes them to selector/diff components
- Provides empty state handling when < 2 versions available
- Responsive drawer container

**Props**:
- `versions`: Array of story versions
- `isLoadingVersions`: Loading state boolean
- `onClose`: Callback to close the comparison panel

### 2. `frontend/src/components/story-comparison/VariationSelector.tsx`
**Purpose**: UI component for selecting two versions to compare.

**Key Features**:
- Dropdown selectors for version 1 and version 2
- Preview cards showing selected version metadata
- Generation type badges with color coding (edited, regenerated, etc.)
- Compare button with validation (disables if same version selected)
- Responsive grid layout (2 columns on desktop, 1 on mobile)

**Props**:
- `versions`: Array of versions
- `selectedVersion1/2`: Currently selected versions
- `onSelectVersion1/2`: Selection callbacks
- `onCompare`: Trigger comparison
- `isLoading`: Button loading state

### 3. `frontend/src/components/story-comparison/DiffViewer.tsx`
**Purpose**: Display side-by-side comparison with diff highlighting using `jsdiff` library.

**Key Features**:
- Character-level diff using `diffChars()` from jsdiff
- Comparison statistics (added/removed character counts)
- Title comparison with highlighting
- Dual-panel content view (Version 1 vs Version 2)
- Full unified diff view (git-style)
- Legend explaining color coding
- Version metadata display (type, creation date)
- Fully responsive with scrollable panels
- Dark mode support

**Diff Display Formats**:
1. **Side-by-side panels**: Version 1 (left) vs Version 2 (right)
   - Only shows unchanged/removed content in left panel
   - Only shows unchanged/added content in right panel
   - Visual alignment for comparison

2. **Unified diff**: Shows all content with + (added) and - (removed) prefixes
   - Similar to git diff output
   - Full context for power users

**Highlighting Colors**:
- ✅ Added: Green background (`bg-green-200/50 dark:bg-green-900/40`)
- ❌ Removed: Red background with strikethrough (`bg-red-200/50 dark:bg-red-900/40`)
- ➡️ Unchanged: Normal text

### 4. `frontend/src/components/story-comparison/DiffHighlight.tsx`
**Purpose**: Reusable component for highlighting text with appropriate styling.

**Props**:
- `text`: The text to highlight
- `type`: "added" | "removed" | "neutral"

**Styling**:
- Applies context-specific colors and borders
- Dark mode support
- Subtle animations on hover

### 5. `frontend/src/components/story-comparison/index.ts`
**Purpose**: Barrel export file for clean imports.

Exports:
```typescript
export { default as ComparisonMode } from "./ComparisonMode";
export { default as VariationSelector } from "./VariationSelector";
export { default as DiffViewer } from "./DiffViewer";
export { default as DiffHighlight } from "./DiffHighlight";
```

Usage: `import { ComparisonMode } from "../story-comparison";`

### 6. `frontend/src/types/jsdiff.d.ts`
**Purpose**: TypeScript type definitions for the `jsdiff` library (which doesn't have official types).

Defines interfaces for:
- `Change` object structure (value, added, removed)
- All jsdiff functions (diffChars, diffWords, diffLines, etc.)
- Patch creation and application functions

---

## Files Modified

### `frontend/src/components/post/post.details.component.tsx`

**Changes Made**:

1. **Added import** (line 15):
```typescript
import { ComparisonMode } from "../story-comparison";
```

2. **Added state** (line 81):
```typescript
const [showComparison, setShowComparison] = useState(false);
```

3. **Added button in Creator Actions Panel** (lines 368-373):
```typescript
<button
  onClick={() => setShowComparison(true)}
  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 rounded-lg transition-all active:scale-95 cursor-pointer font-semibold shadow-md"
>
  📊 Compare Variations
</button>
```

4. **Added Story Comparison Drawer** (lines 640-663):
```typescript
{showComparison && (
  <div className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl bg-white dark:bg-[#0f172a]/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-700/60 shadow-2xl overflow-y-auto animate-slide-in flex flex-col">
    {/* Header and close button */}
    {/* ComparisonMode component */}
  </div>
)}
```

**Integration Points**:
- Story versions already loaded via `useGetVersionsByStoryIdQuery`
- Reuses existing version timeline data
- Follows existing design patterns (drawer panels)
- Only shows button to story author

---

## Data Flow Architecture

```
PostDetailsComponent
├── State Management
│   ├── showComparison (boolean)
│   ├── versions (via RTK Query)
│   └── isLoadingVersions (boolean)
│
└── ComparisonMode (when showComparison = true)
    ├── VariationSelector
    │   ├── selectedVersion1
    │   ├── selectedVersion2
    │   └── onCompare()
    │
    └── DiffViewer (when comparing)
        ├── diffChars() from jsdiff
        ├── Statistics calculation
        ├── titleDiff comparison
        ├── Content side-by-side view
        └── Unified diff view

Legend:
→ User Action (Select/Compare)
→ Data Flow
← UI Update
```

---

## Component Relationships

```
PostDetailsComponent (Story Detail Page)
│
├─ Existing: Timeline Drawer (✨ Story Timeline & History)
│
└─ New: Comparison Drawer (📊 Compare Variations)
   │
   └─ ComparisonMode Container
      │
      ├─ View 1: VariationSelector
      │  ├─ Version 1 Dropdown
      │  ├─ Version 1 Preview Card
      │  ├─ Version 2 Dropdown
      │  ├─ Version 2 Preview Card
      │  └─ Compare Button
      │
      └─ View 2: DiffViewer
         ├─ Header with Back Button
         ├─ Statistics Panel (4 cards)
         ├─ Legend
         ├─ Title Comparison
         ├─ Content Comparison
         │  ├─ Side-by-side Panels
         │  │  ├─ Version 1 View (left)
         │  │  └─ Version 2 View (right)
         │  │     └─ DiffHighlight components
         │  │
         │  └─ Unified Diff View
         │
         └─ Version Info Footer
```

---

## Styling & Design System

### Color Tokens (from Tailwind config)
- **Primary gradient**: `from-cyan-500 to-blue-600` (button)
- **Added text**: `bg-green-200/50 dark:bg-green-900/40`
- **Removed text**: `bg-red-200/50 dark:bg-red-900/40`
- **Card backgrounds**: `bg-slate-50 dark:bg-slate-900/50`

### Responsive Behavior
- **Desktop**: Max-width 3xl drawer, side-by-side panels
- **Tablet (md)**: 2-column grid for version selectors
- **Mobile**: Single column, stacked panels, full-width drawer

### Animations
- Drawer slide-in: `animate-slide-in`
- Button hover: `hover:opacity-90` with `active:scale-95`
- Version selection cards: Smooth transitions

### Dark Mode Support
- All components use `dark:` prefixes
- Consistent color inversion strategy
- Maintained contrast ratios

---

## API Integration

### Existing RTK Query Hooks Used
```typescript
useGetVersionsByStoryIdQuery(id)
// Returns: IStoryVersion[]
// Already fetched in PostDetailsComponent
// Skips fetching if !id || !showTimeline
```

### Data Structure: IStoryVersion
```typescript
interface IStoryVersion {
  _id: string;
  storyId: string;
  content: string;           // Full story text
  title: string;             // Story title
  prompt?: string;           // Generation prompt
  generationType: string;    // 'initial' | 'regenerated' | 'edited' | 'alternate-ending' | 'restored'
  versionNumber: number;     // Sequential version (1, 2, 3...)
  createdBy: string;         // User ID
  createdAt: string;         // ISO timestamp
  updatedAt: string;         // ISO timestamp
}
```

### API Endpoint Used
```
GET /api/v1/story/{postId}/versions
Response: IStoryVersion[]
```

---

## Key Features Implemented

### ✅ Version Selection
- Dropdown with all available versions
- Shows version number, type, and creation date
- Preview card with metadata
- Prevents selecting same version twice

### ✅ Diff Visualization
- **Character-level granularity**: jsdiff compares individual characters
- **Title comparison**: Separate diff view for titles
- **Content comparison**: Multiple views
  - Side-by-side (compact)
  - Unified diff (detailed)
- **Visual indicators**: Color-coded highlighting

### ✅ Statistics Panel
- Version numbers
- Character count of additions
- Character count of removals
- Similarity percentage

### ✅ Responsive Design
- Mobile: Full-width drawer with stacked panels
- Tablet: 2-column grid for selectors
- Desktop: 3-column max-width with scrollable content

### ✅ Dark Mode
- Full dark mode support using TailwindCSS `dark:` prefix
- Proper contrast ratios maintained
- Consistent visual hierarchy

### ✅ User Experience
- Loading states (spinner while analyzing)
- Empty state (when < 2 versions)
- Error handling (same version selected)
- Back button to return to selection
- Close button to exit comparison
- Smooth animations and transitions

---

## Usage Instructions for Users

### To Compare Story Variations:

1. **Open a story** you've written (navigate to `/post/:id`)
2. **Look for the creator action panel** (only visible if you're the author)
3. **Click "📊 Compare Variations"** button
4. **Select two different versions** from the dropdowns
5. **Click "🔍 Compare Variations"** to see the differences
6. **Review the comparison**:
   - Statistics show what changed (characters added/removed)
   - Side-by-side view shows content in context
   - Unified diff shows all changes in one view
7. **Click "← Back to Selection"** to compare different versions
8. **Click "✕"** to close the comparison panel

---

## Development Notes

### Installation & Dependencies

1. **jsdiff** - Already installed
   ```bash
   npm install jsdiff --save
   ```

2. **Type Definitions** - Created custom `.d.ts` file
   - Located at: `frontend/src/types/jsdiff.d.ts`
   - Covers all major jsdiff functions

### Running the Feature

```bash
# Start development server
npm run dev

# Navigate to any story you created
# Example: http://localhost:5173/post/64f1a2b3c4d5e6f7g8h9i0j1

# Click "📊 Compare Variations" button
```

### Testing Scenarios

1. **With 0-1 versions**: Shows "No Variations Available" message
2. **With 2+ versions**: Full comparison workflow available
3. **Same version selected**: Shows validation warning, compare button disabled
4. **Different versions**: Shows detailed diff view
5. **Mobile view**: Drawer and panels stack responsively

---

## Architecture Decisions

### Why Character-Level Diff?
- Captures fine-grained changes
- Shows word-level edits within sentences
- Better for prose/creative writing
- More granular than line-level diffs

### Why Side-by-Side + Unified View?
- **Side-by-side**: Easy comparison, visual alignment
- **Unified**: Git-style diff, familiar to developers
- Both views cater to different user preferences

### Why Separate Selection Step?
- Prevents accidental comparisons
- Allows previewing version metadata before comparing
- Better UX flow with clear states

### Why Drawer Panel?
- Matches existing timeline drawer pattern
- Consistent with app design language
- Non-blocking (user can close anytime)
- Responsive (adapts to screen size)

---

## Future Enhancement Ideas

1. **Export comparison** as PDF or markdown
2. **Compare more than 2 versions** (multi-select)
3. **Word-level diff** instead of character-level
4. **Diff highlighting** in version timeline
5. **Restore from comparison** (directly restore version)
6. **Change annotations** (user notes on differences)
7. **Version branching** (create story from specific version)
8. **Collaborative comparison** (share comparison link)

---

## Troubleshooting

### Comparison button not showing?
- Only visible if you're the story author
- Check that `isAuthor` variable is true

### No versions available?
- You need at least 2 versions to compare
- Edit the story or regenerate to create versions

### Comparison seems slow?
- Large content (10k+ characters) takes more time
- Normal for first comparison (jsdiff analysis)

### Styling looks broken?
- Clear browser cache
- Restart dev server
- Check dark mode toggle

---

## File Summary

| File | Type | Lines | Purpose |
|------|------|-------|---------|
| ComparisonMode.tsx | Component | ~120 | Main container |
| VariationSelector.tsx | Component | ~180 | Version selection UI |
| DiffViewer.tsx | Component | ~280 | Diff visualization |
| DiffHighlight.tsx | Component | ~25 | Reusable highlight |
| index.ts | Export | ~4 | Barrel exports |
| jsdiff.d.ts | Types | ~80 | Type definitions |
| post.details.component.tsx | Modified | - | Integration + button |

**Total New Code**: ~690 lines (components)
**New Dependencies**: jsdiff (already installed)

---

## Clean Code Principles Applied

✅ **Single Responsibility**: Each component has one clear purpose
✅ **Composability**: Small, reusable components (DiffHighlight)
✅ **Prop Drilling Minimized**: Container manages state, passes down
✅ **No Unnecessary Abstractions**: Direct diff computation
✅ **Type Safety**: Full TypeScript coverage
✅ **Accessibility**: ARIA labels, semantic HTML
✅ **Performance**: useMemo for expensive diff operations
✅ **Responsive**: Mobile-first design
✅ **Dark Mode**: Full support without extra components
✅ **Following Project Patterns**: Uses TailwindCSS, Redux hooks, existing drawer patterns

---

## Next Steps

1. **Test the feature**:
   - Create/edit a story to generate versions
   - Click "Compare Variations" button
   - Select 2 versions and compare

2. **Verify responsive design**:
   - Test on mobile, tablet, desktop
   - Check dark mode

3. **Gather user feedback**:
   - Is the diff view clear?
   - Are the colors appropriate?
   - Any missing features?

4. **Optional: Add tests**:
   - Unit tests for diff logic
   - Integration tests for component flow

---

Created: 2026-05-30
Implementation Status: ✅ Complete
