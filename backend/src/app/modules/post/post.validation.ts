import { z } from "zod";

/**
 * Reusable MongoDB ObjectId validator.
 *
 * Security: enforcing a 24-character hexadecimal string is what blocks NoSQL
 * operator-injection payloads such as `{ "$ne": null }`, `{ "$gt": "" }` or
 * `{ "$where": "..." }`. Those arrive as objects (or non-hex strings), so Zod
 * rejects them here — long before the value can reach a Mongoose query like
 * `Post.findOne({ _id: value })` where an attacker-controlled operator object
 * would otherwise match unintended documents.
 */
const objectId = (field: string) =>
  z
    .string({
      required_error: `${field} is required!`,
      invalid_type_error: `${field} must be a string`,
    })
    .regex(/^[a-f\d]{24}$/i, `${field} must be a valid MongoDB ObjectId`);

const TopicSchema = z.object({
  title: z.string({ required_error: "Topic title is required!" }).max(50),
  color: z.string({ required_error: "Topic color is required!" }).max(50),
  selected: z.boolean({
    required_error: "Topic selection status is required!",
  }),
});

/**
 * Create-post payload contract.
 *
 * Unknown keys are stripped by Zod's default object behaviour, so privileged
 * fields a client may try to smuggle in (`author`, `isFeaturedPost`,
 * `isDeleted`, `likesCount`, ...) never survive validation. This is the first
 * line of defence against mass-assignment; the service layer adds a second one
 * by only forwarding an explicit allow-list to the database.
 */
const createPost = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required!" })
      .min(3, "Title must be at least 3 characters long")
      .max(200, "Title cannot exceed 200 characters"),
    content: z
      .string({ required_error: "Content is required!" })
      .min(10, "Content must be at least 10 characters long")
      .max(50000, "Content cannot exceed 50000 characters"),
    tag: z.string({ required_error: "Tag is required!" }).max(50),
    imageURL: z
      .string({ required_error: "Image URL is required!" })
      .url("Invalid image URL format")
      .max(2000),
    topic: z
      .array(TopicSchema)
      .min(2, { message: "At least two topics are required!" })
      .max(20),
    language: z.string().max(50).optional(),
  }),
});

/**
 * Update-post payload contract.
 *
 * - `params.id` is validated as an ObjectId. This both rejects malformed ids
 *   (a clean 400 instead of a Mongoose CastError 500) and ensures the
 *   validation middleware preserves `req.params` for the controller.
 * - `prompt` / `generationType` are optional AI-edit metadata consumed by the
 *   version-snapshot service; declaring them here keeps them validated instead
 *   of being silently dropped.
 */
const updatePost = z.object({
  params: z.object({
    id: objectId("id"),
  }),
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    content: z.string().min(10).max(50000).optional(),
    tag: z.string().max(50).optional(),
    imageURL: z.string().url().max(2000).optional(),
    topic: z.array(TopicSchema).min(2).max(20).optional(),
    language: z.string().max(50).optional(),
    isPublished: z.boolean().optional(),
    prompt: z.string().max(2000).optional(),
    generationType: z.string().max(50).optional(),
  }),
});

/**
 * Remix payload contract for `POST /post/remix`.
 *
 * Previously this route read `req.body.postId` unvalidated and passed it
 * straight into `Post.findOne({ _id: postId })`, allowing operator injection.
 * Forcing `postId` to be an ObjectId string closes that hole.
 */
const remixStory = z.object({
  body: z.object({
    postId: objectId("postId"),
    prompt: z
      .string({ required_error: "Prompt is required!" })
      .min(1, "Prompt cannot be empty")
      .max(500, "Prompt cannot exceed 500 characters"),
  }),
});

/**
 * Translate payload contract for `POST /post/translate`.
 * Same injection hardening as remix, for the `postId` field.
 */
const translateStory = z.object({
  body: z.object({
    postId: objectId("postId"),
    language: z
      .string({ required_error: "Language is required!" })
      .min(1, "Language cannot be empty")
      .max(50, "Language cannot exceed 50 characters"),
  }),
});

/**
 * Generic ObjectId route-param guard (e.g. `DELETE /post/:id`). Rejects
 * malformed ids early and keeps `req.params` intact through validation.
 */
const postIdParam = z.object({
  params: z.object({
    id: objectId("id"),
  }),
});

const bulkDelete = z.object({
  body: z.object({
    ids: z.array(
      z.string({
        required_error: "ID must be a string",
      }),
      {
        required_error: "ids is required",
      }
    ),
  }),
});

export const PostValidator = {
  createPost,
  updatePost,
  remixStory,
  translateStory,
  postIdParam,
  bulkDelete,
};
