# Recommendation API Endpoint

## Overview

The recommendation endpoint returns personalized story recommendations based on the authenticated user's reading preferences and browsing history.

## Endpoint

```
GET /api/v1/recommendations
```

## Authentication

Requires a valid JWT Bearer token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

The token payload must include:
- `_id` or `userId` (string): User identifier
- `email` (string): User email
- `role` (string): One of `user`, `admin`, `super_admin`, `writer`, `guest`
- `subscriptionType` (string): One of `free`, `pro`, `premium`
- `exp` (number): Expiration timestamp (Unix seconds)
- `iat` (number): Issued-at timestamp (Unix seconds)

## Request

No request body required.

### Query Parameters

None.

## Response

### Success (200 OK)

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Personalized recommendations fetched successfully!",
  "data": [
    {
      "_id": "64abc123def456",
      "title": "The Lost Kingdom",
      "imageURL": "https://example.com/image.jpg",
      "author": {
        "name": "Jane Author",
        "profile": {
          "avatar": "https://example.com/avatar.jpg"
        }
      },
      "emotions": ["adventure", "mystery"],
      "genre": "Fantasy",
      "likesCount": 342,
      "viewsCount": 1820,
      "publishedAt": "2025-03-15T10:30:00.000Z",
      "createdAt": "2025-03-10T08:00:00.000Z"
    }
  ]
}
```

### Error Responses

| Status | Condition |
|--------|-----------|
| 401 Unauthorized | Missing or invalid JWT token |
| 404 Not Found | User not found in database |
| 500 Internal Server Error | Unexpected server error |

### Error Response Format

```json
{
  "success": false,
  "message": "User not found",
  "stack": "..."
}
```

## Algorithm

1. The service loads the user's `readingPreferences` and `readingHistory` from the database.
2. Posts already in the user's reading history are excluded from recommendations.
3. If the user has reading preferences (favorite genres or emotions), posts matching those preferences are ranked by `likesCount` and `viewsCount`.
4. If fewer than 10 personalized recommendations are found, popular published posts (excluding already-recommended ones) fill the remaining slots.
5. The result is limited to 10 posts maximum.

## Related Files

- Controller: `backend/src/app/modules/recommendation/recommendation.controller.ts`
- Service: `backend/src/app/modules/recommendation/recommendation.service.ts`
- Router: `backend/src/app/modules/recommendation/recommendation.router.ts`
