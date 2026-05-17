# Like / Reaction Feature Documentation

This document explains the implementation of the Like/Reaction system in Story Spark AI.

## Overview
The Like system allows registered users to react to stories. It uses a many-to-many relationship model where a single user can react to multiple posts, and a post can have multiple reactions.

## Technical Architecture

### 1. Database Schema
- **Reaction Model**: Stores `postId`, `userId`, and the reaction `type` (default is "like").
- **Post Model**: Contains a `likesCount` (Number) and a `reactions` array (List of ObjectIDs) for quick indexing.

### 2. Backend (Node.js/Express/Mongoose)
- **Module**: `backend/src/app/modules/reaction`
- **Toggle Logic**: The system uses a single "toggle" endpoint (`POST /api/v1/reaction/toggle`).
    - If a reaction from the user already exists for the post, it is **removed**, and the `likesCount` is decremented.
    - If no reaction exists, a new one is **created**, and the `likesCount` is incremented.
- **Data Invalidation**: The system ensures atomicity by updating both the `Reaction` collection and the `Post` document in the same service call.

### 3. Frontend (React/Redux RTK Query)
- **API Slice**: `frontend/src/redux/apis/reaction.api.ts`
- **State Sync**: Uses `invalidatesTags: [tagTypes.post]`. When a user clicks like, the specific post data is refetched automatically to update the count and heart color.
- **UI Components**:
    - `ExploreViewListComponent`: Handles likes in the card-grid view.
    - `PostDetailsComponent`: Handles likes on the full story page.
- **User Detection**: The frontend determines if a post is "liked" by checking if the logged-in user's email exists in the populated `reactions` array of the post.

## How to use
1. Ensure you are logged in.
2. Click the Heart icon on any story card or detail page.
3. The icon will turn **solid red** to indicate a successful like.
4. Click again to unlike.
