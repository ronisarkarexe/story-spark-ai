# Multi-Branching "Choose Your Own Adventure" Story Logic

## Overview

This document describes the implementation of multi-branching story logic that enables "Choose Your Own Adventure" style narratives in Story Spark AI. Users can create interactive stories with multiple decision points, branches, and paths, while the system tracks user choices, popular paths, and story integrity.

## Features Implemented

### 1. **Data Models & Database**

#### StorySegment Schema
- Represents individual segments/nodes in a branching story tree
- Stores content, choices, and metadata
- Supports parent-child relationships for tree structure
- Indexed for efficient queries:
  - `{storyId, parentSegmentId}` - branch traversal
  - `{storyId, branchPath}` - unique path tracking
  - `{storyId, branchDepth}` - tree level queries

**Key Fields:**
- `storyId` - Reference to the main story (Post)
- `parentSegmentId` - Reference to parent segment (null for root)
- `content` - Story text for this segment
- `choices` - Array of decision options
- `branchPath` - Hierarchical path identifier (e.g., "root/1/2")
- `branchDepth` - Tree depth (0 for root)
- `isLeaf` - Whether segment is a terminal node

#### UserChoiceProgress Schema
- Tracks individual user's journey through a branching story
- Records choice history with timestamps
- Manages story completion status
- One entry per user-story combination

**Key Fields:**
- `userId` - Reference to user
- `storyId` - Reference to story
- `currentSegmentId` - Current position in story
- `choiceHistory` - Array of choices with timestamps
- `completedAt` - When story was finished
- `isActive` - Whether journey is ongoing

#### BranchStatistics Schema
- Aggregates choice popularity metrics
- Enables analytics on user behavior
- Tracks selection frequency and percentage

**Key Fields:**
- `storyId` - Reference to story
- `segmentId` - Which segment contains choice
- `choiceId` - Which choice
- `totalSelections` - Total times selected
- `percentageSelected` - Percentage of total choices

### 2. **Backend API Endpoints**

#### POST `/api/v1/story-branches`
Create a new branching story with root segment.

**Request:**
```json
{
  "storyId": "507f1f77bcf86cd799439011",
  "initialContent": "Once upon a time...",
  "choices": [
    { "text": "Go left" },
    { "text": "Go right" },
    { "text": "Stay put" }
  ],
  "genre": "fantasy"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Branching story created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "storyId": "507f1f77bcf86cd799439011",
    "content": "Once upon a time...",
    "choices": [
      { "id": "uuid-1", "text": "Go left" },
      { "id": "uuid-2", "text": "Go right" },
      { "id": "uuid-3", "text": "Stay put" }
    ],
    "branchPath": "root",
    "branchDepth": 0,
    "isLeaf": false
  }
}
```

#### POST `/api/v1/story-branches/segments`
Create a new segment branching from a parent.

**Request:**
```json
{
  "storyId": "507f1f77bcf86cd799439011",
  "parentSegmentId": "507f1f77bcf86cd799439020",
  "content": "You walk down the left path...",
  "choices": [
    { "text": "Continue forward" },
    { "text": "Turn back" }
  ]
}
```

**Response:** Returns the newly created segment.

#### GET `/api/v1/story-branches/:storyId/tree`
Retrieve complete branch tree for visualization.

**Query Parameters:**
- `maxDepth` (optional) - Limit tree depth

**Response:**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "507f1f77bcf86cd799439020",
        "parentId": null,
        "branchPath": "root",
        "branchDepth": 0,
        "choicesCount": 3,
        "isLeaf": false
      }
    ],
    "edges": [
      {
        "source": "507f1f77bcf86cd799439020",
        "target": "507f1f77bcf86cd799439021"
      }
    ],
    "totalSegments": 15
  }
}
```

#### POST `/api/v1/story-branches/choices/record`
Record user choice and advance progress.

**Request:**
```json
{
  "storyId": "507f1f77bcf86cd799439011",
  "currentSegmentId": "507f1f77bcf86cd799439020",
  "choiceId": "uuid-1",
  "choiceText": "Go left"
}
```

**Response:** Returns updated user progress.

#### GET `/api/v1/story-branches/:storyId/progress`
Get user's progress through a branching story.

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439002",
    "storyId": "507f1f77bcf86cd799439011",
    "currentSegmentId": "507f1f77bcf86cd799439021",
    "choiceHistory": [
      {
        "segmentId": "507f1f77bcf86cd799439020",
        "choiceId": "uuid-1",
        "choiceText": "Go left",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "isActive": true,
    "completedAt": null
  }
}
```

#### GET `/api/v1/story-branches/:storyId/statistics`
Get choice statistics for a story.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "storyId": "507f1f77bcf86cd799439011",
      "segmentId": "507f1f77bcf86cd799439020",
      "choiceId": "uuid-1",
      "totalSelections": 47,
      "percentageSelected": 65.3
    }
  ]
}
```

#### GET `/api/v1/story-branches/:storyId/statistics/summary`
Get comprehensive statistics summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSegments": 25,
    "totalChoices": 67,
    "totalSelections": 523,
    "avgSegmentsPerPath": "8.5",
    "mostPopularChoices": [...]
  }
}
```

#### POST `/api/v1/story-branches/validate`
Validate branch integrity.

**Request:**
```json
{
  "storyId": "507f1f77bcf86cd799439011",
  "checkCircular": true,
  "checkOrphaned": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "errors": [],
    "warnings": [],
    "stats": {
      "totalSegments": 25,
      "orphanedSegments": 0,
      "circularReferences": 0,
      "deadEnds": 2
    }
  }
}
```

#### DELETE `/api/v1/story-branches/segments/:segmentId`
Delete a segment and its children (cascade delete).

**Response:**
```json
{
  "success": true,
  "message": "Segment deleted successfully"
}
```

### 3. **Service Layer (Backend)**

The `StoryBranchingService` class provides the core business logic:

- **createBranchingStory()** - Initialize branching story with root segment
- **createSegment()** - Add new segment to tree
- **getBranchTree()** - Retrieve tree structure with optional depth limit
- **recordUserChoice()** - Track user selection and update progress
- **getUserProgress()** - Fetch user's current journey
- **getChoiceStatistics()** - Get choice popularity data
- **validateBranchIntegrity()** - Check for data integrity issues
- **deleteSegment()** - Cascade delete segments
- **updateChoiceStatistics()** - Internal method to track metrics

### 4. **Frontend Components**

#### StoryBranchingReader
Main component for reading/playing branching stories.

**Props:**
```typescript
interface Props {
  storyId: string;
  onChoiceMade?: (choice: string) => void;
}
```

**Features:**
- Displays current segment content
- Shows available choices as interactive buttons
- Tracks progress
- Auto-loads user's previous position
- Indicates story completion

**Usage:**
```tsx
<StoryBranchingReader 
  storyId="story-123"
  onChoiceMade={(choice) => console.log(`User chose: ${choice}`)}
/>
```

#### BranchTree
Visualizes the complete story tree structure.

**Props:**
```typescript
interface Props {
  storyId: string;
  maxDepth?: number;
  onNodeClick?: (nodeId: string) => void;
}
```

**Features:**
- Expandable/collapsible tree nodes
- Shows branch paths and statistics
- Marks leaf (end) nodes
- Interactive node selection
- Scrollable with large trees

#### BranchStatistics
Displays choice analytics and popular paths.

**Props:**
```typescript
interface Props {
  storyId: string;
}
```

**Features:**
- Total segments, choices, and selections
- Average path length
- Top 10 most popular choices
- Visual ranking display
- Percentage calculations

### 5. **Frontend Service**

The `BranchingService` class provides API integration:

```typescript
// Create branching story
await BranchingService.createBranchingStory(storyId, content, choices);

// Create segment
await BranchingService.createSegment(storyId, parentId, content, choices);

// Get tree
const tree = await BranchingService.getBranchTree(storyId, maxDepth);

// Record choice
const progress = await BranchingService.recordUserChoice(
  storyId, 
  segmentId, 
  choiceId, 
  choiceText
);

// Get progress
const progress = await BranchingService.getUserProgress(storyId);

// Get statistics
const stats = await BranchingService.getChoiceStatistics(storyId);
const summary = await BranchingService.getStatisticsSummary(storyId);

// Validate integrity
const validation = await BranchingService.validateBranchIntegrity(storyId);

// Delete segment
await BranchingService.deleteSegment(segmentId);
```

## Edge Cases Handled

### 1. **Circular References**
The system detects circular parent-child relationships using depth-first search (DFS) and prevents them from being created.

### 2. **Orphaned Segments**
Validates that all segments have valid parent references except the root.

### 3. **Dead Ends**
Identifies leaf segments with unlinked choices and reports them in validation.

### 4. **Maximum Branch Depth**
Optional depth limiting prevents extremely deep trees from overwhelming the database.

### 5. **Concurrent Modifications**
Database indexes and unique constraints prevent race conditions during simultaneous choice recordings.

### 6. **Cascade Deletion**
When a segment is deleted, all children are recursively deleted and associated statistics are cleaned up.

### 7. **User Authorization**
Only the creator of a segment can delete it. Non-creators receive a 403 Forbidden error.

### 8. **Large Content**
Content length validation prevents excessively large segments (max 10,000 chars per segment).

### 9. **Choice Limits**
Maximum 5 choices per segment to maintain readability and database efficiency.

## Security Considerations

### 1. **API Keys Never Exposed**
All API credentials remain server-side only. Frontend uses JWT authentication.

### 2. **Input Validation**
- Zod schemas validate all API inputs
- Content sanitization prevents injection attacks
- Choice text is truncated and validated

### 3. **Rate Limiting**
- Global rate limiter applies to all endpoints
- User choice recording has per-user limits
- Prevents abuse of statistics tracking

### 4. **Authentication Required**
- User must be authenticated to create/modify stories
- Only authenticated users can record choices
- Segment deletion requires creator authentication

### 5. **Data Privacy**
- User choice history is private to that user
- Statistics are aggregated anonymously
- No personal data in choice tracking

## Performance Optimizations

### Database Indexes
1. `{storyId, parentSegmentId}` - Branch traversal
2. `{storyId, branchPath}` - Path uniqueness
3. `{storyId, segmentIndex}` - Timeline queries
4. `{storyId, branchDepth}` - Depth filtering
5. `{userId, storyId}` - User progress lookup
6. `{userId, isActive}` - Active story filtering

### Query Optimization
- `maxDepth` parameter limits recursive queries
- Select only needed fields in aggregations
- Use index-covered queries where possible

### Caching Opportunities
- Cache branch trees with TTL
- Cache user progress for active stories
- Cache statistics summaries

## Testing

Comprehensive test suites are included for:

### Backend Tests (`story_branching.service.test.ts`)
- createBranchingStory functionality
- createSegment with depth tracking
- getBranchTree with max depth
- User choice recording
- Branch integrity validation
- Edge cases (circular refs, orphaned segments, etc.)

### Controller Tests (`story_branching.controller.test.ts`)
- API endpoint validation
- Request/response formats
- Error handling
- Authentication enforcement

Tests cover:
- Happy paths
- Error scenarios
- Edge cases
- Input validation
- Authorization checks

## Usage Examples

### Creating a Branching Story

**Backend:**
```typescript
const segment = await StoryBranchingService.createBranchingStory(
  storyId,
  userId,
  "You wake up in a mysterious forest...",
  [
    { text: "Explore north" },
    { text: "Explore south" },
    { text: "Stay put and rest" }
  ]
);
```

**Frontend:**
```typescript
await BranchingService.createBranchingStory(
  storyId,
  "You wake up in a mysterious forest...",
  [
    { text: "Explore north" },
    { text: "Explore south" },
    { text: "Stay put and rest" }
  ],
  "fantasy"
);
```

### Reading a Branching Story

```tsx
<StoryBranchingReader 
  storyId={storyId}
  onChoiceMade={(choice) => {
    console.log(`User selected: ${choice}`);
    // Could trigger achievements, notifications, etc.
  }}
/>
```

### Viewing Story Analytics

```tsx
<div>
  <BranchTree storyId={storyId} maxDepth={5} />
  <BranchStatistics storyId={storyId} />
</div>
```

## Future Enhancements

1. **Branching Limits by Tier**
   - Free: max 5 segments
   - Pro: max 50 segments
   - Premium: unlimited

2. **Collaborative Branching**
   - Multiple authors contribute to same story
   - Merge strategies for parallel branches

3. **Visualization Improvements**
   - Graph-based tree rendering (D3.js/Cytoscape)
   - Animation of user choices
   - 3D tree exploration for large stories

4. **Advanced Analytics**
   - Heatmaps of popular choices
   - Average completion time per path
   - Drop-off analysis

5. **AI Integration**
   - Auto-generate next segment suggestions
   - Consistency checking across branches
   - Automatic choice generation

6. **Community Features**
   - Share branching stories
   - Leaderboard of most played branches
   - Community voting on choices

## Troubleshooting

### Story Tree Not Loading
- Check MongoDB connection
- Verify story ID exists
- Check user authentication

### Choices Not Recording
- Confirm user is authenticated
- Verify choice ID matches segment choices
- Check database write permissions

### Circular Reference Detected
- Ensure parent segment is different from current
- Check for accidental self-references
- Use validation endpoint to identify issues

### Performance Issues
- Reduce maxDepth in queries
- Add database indexes if missing
- Check MongoDB query performance

## References

- [Backend Architecture](../ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Testing Guide](./TESTING.md)
