

## File: backend/src/app/modules/auth/auth.controller.ts (Conflict 1)
### HEAD (Ours):
```typescript
import { OtpModel } from "./otp.model";
import nodemailer from "nodemailer";
```
### upstream/main (Theirs):
```typescript
import { VerifyEmailService } from "../verify_email/verify_email.service";
```


## File: backend/src/app/modules/auth/auth.controller.ts (Conflict 2)
### HEAD (Ours):
```typescript

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to the database
  await OtpModel.create({ email, otp });

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  });

  res.status(200).json({ message: "OTP sent successfully" });
```
### upstream/main (Theirs):
```typescript
  const result = await VerifyEmailService.VerifyEmail({ email, name: "User" });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent successfully!",
    data: result,
  });
```


## File: backend/src/app/modules/post/post.controller.ts (Conflict 1)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
  const limit = req.query.limit ? Math.min(Number(req.query.limit), 50) : 10;
```


## File: backend/src/app/modules/story_version/enhance_prompt.utils.ts (Conflict 1)
### HEAD (Ours):
```typescript
Prompt: ${prompt.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ").replace(/\r/g, "")}

```
### upstream/main (Theirs):
```typescript
```


## File: backend/src/app/modules/story_version/enhance_prompt.utils.ts (Conflict 2)
### HEAD (Ours):
```typescript
Prompt: ${prompt.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}`;
```
### upstream/main (Theirs):
```typescript
Prompt: ${prompt}`;
```


## File: backend/src/app/modules/story_version/story_version.controller.ts (Conflict 1)
### HEAD (Ours):
```typescript
  let post = null;
  if (storyId) {
    const cleanStoryId = String(storyId);
    if (!mongoose.Types.ObjectId.isValid(cleanStoryId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid storyId");
    }
    post = await Post.findOne({ _id: { $eq: cleanStoryId } });
  }

  const enhancedPrompt = await StoryVersionService.enhancePrompt(
    prompt.trim(),
    post?.content
```
### upstream/main (Theirs):
```typescript
  const post = storyId ? await Post.findById(storyId) : null;
  const rawProvider = req.headers?.["x-model-provider"];
  const provider = Array.isArray(rawProvider) ? rawProvider[0] : rawProvider;
  
  const enhancedPrompt = await StoryVersionService.enhancePrompt(
    prompt.trim(),
    post?.content || undefined,
    provider as string | undefined
```


## File: backend/src/app/modules/story_version/story_version.service.ts (Conflict 1)
### HEAD (Ours):
```typescript
import { contextCompressor } from "../../../utils/contextCompressor";
import { enhancePromptWithGemini } from "./enhance_prompt.utils";
```
### upstream/main (Theirs):
```typescript
import { enhancePromptWithGemini, enhancePromptWithOpenAI, enhancePromptWithAnthropic } from "./enhance_prompt.utils";
```


## File: backend/src/app/modules/story_version/story_version.service.ts (Conflict 2)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
import { compressContext, serializeLore } from "../../../utils/contextCompressor";
```


## File: backend/src/app/modules/story_version/story_version.service.ts (Conflict 3)
### HEAD (Ours):
```typescript
const enhancePrompt = async (
  prompt: string,
  storyContent?: string
): Promise<string> => {
  try {
    const compressed = storyContent
      ? contextCompressor(storyContent)
      : null;

    const enhanced = await raceGenerationWithTimeout(
      (signal) =>
        enhancePromptWithGemini(
          prompt,
          signal,
          compressed?.compressedText
        ),
```
### upstream/main (Theirs):
```typescript
const buildCompressedContext = (storyContext: string): string => {
  if (!storyContext.trim()) return "";
  const rawNodes = storyContext
    .split(/(?=\[Player chose:)/g)
    .map((chunk, i) => ({ id: `seg-${i}`, text: chunk.trim() }));
  const { lore, window: contextWindow } = compressContext(rawNodes);
  return `${serializeLore(lore)}\n\n${contextWindow.map((n) => n.text).join("\n")}`;
};

const enhancePrompt = async (
  prompt: string,
  storyContentOrProvider?: string,
  providerParam?: string
): Promise<string> => {
  let storyContent = "";
  let provider = providerParam;

  if (storyContentOrProvider) {
    const lower = storyContentOrProvider.toLowerCase();
    if (lower === "gemini" || lower === "openai" || lower === "anthropic" || lower === "claude") {
      provider = storyContentOrProvider;
    } else {
      storyContent = storyContentOrProvider;
    }
  }

  const compressedContext = storyContent ? buildCompressedContext(storyContent) : "";

  try {
    const enhanced = await raceGenerationWithTimeout(
      async (signal) => {
        const p = provider?.toLowerCase();
        if (p === "anthropic" || p === "claude") {
          return enhancePromptWithAnthropic(prompt, signal);
        } else if (p === "openai") {
          return enhancePromptWithOpenAI(prompt, signal);
        } else {
          return enhancePromptWithGemini(prompt, signal, compressedContext || undefined);
        }
      },
```


## File: backend/src/controllers/payment.controller.ts (Conflict 1)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
import { User } from "../app/modules/user/user.model";
```


## File: backend/src/services/ai.service.ts (Conflict 1)
### HEAD (Ours):
```typescript
let anthropic: Anthropic | null = null;

```
### upstream/main (Theirs):
```typescript
```


## File: backend/src/services/analysis.service.ts (Conflict 1)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript

```


## File: backend/src/socket/collab.socket.ts (Conflict 1)
### HEAD (Ours):
```typescript
    socket.on("collab:yjs-update", ({ roomId, update }) => {
      socket.to(roomId).emit("collab:yjs-update", {
        update,
      });
    });

    // Awareness / cursor updates
    socket.on("collab:awareness", ({ roomId, awareness }) => {
      socket.to(roomId).emit("collab:awareness", {
        awareness,
      });
```
### upstream/main (Theirs):
```typescript
    socket.on("collab:yjs-update", async ({ roomId, update }) => {
      try {
        const userId = socket.data.userId;
        const room = await CollabRoom.findOne({ roomId });
        if (!room) {
          socket.emit("collab:error", { message: "Room not found" });
          return;
        }

        const participant = room.participants.find((p) => p.userId === userId);
        if (!participant) {
          socket.emit("collab:error", { message: "You are not a participant of this room" });
          return;
        }

        socket.to(roomId).emit("collab:yjs-update", { update });
      } catch (error) {
        logger.error("Error in Yjs update", error);
        socket.emit("collab:error", { message: "Failed to broadcast update" });
      }
    });

    // Awareness / cursor updates
    socket.on("collab:awareness", async ({ roomId, awareness }) => {
      try {
        const userId = socket.data.userId;
        const room = await CollabRoom.findOne({ roomId });
        if (!room) {
          socket.emit("collab:error", { message: "Room not found" });
          return;
        }

        const participant = room.participants.find((p) => p.userId === userId);
        if (!participant) {
          socket.emit("collab:error", { message: "You are not a participant of this room" });
          return;
        }

        socket.to(roomId).emit("collab:awareness", { awareness });
      } catch (error) {
        logger.error("Error in Yjs awareness", error);
        socket.emit("collab:error", { message: "Failed to broadcast awareness" });
      }
```


## File: backend/src/utils/contextCompressor.ts (Conflict 1)
### HEAD (Ours):
```typescript

export interface ICompressedContext {
  characters: string[];
  keyEvents: string[];
  setting: string[];
  compressedText: string;
}

export function contextCompressor(fullStory: string): ICompressedContext {
  if (!fullStory) {
    return {
      characters: [],
      keyEvents: [],
      setting: [],
      compressedText: ""
    };
  }

  const sentences = fullStory.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);

  const characters = new Set<string>();
  const keyEvents: string[] = [];
  const setting = new Set<string>();

  for (const sentence of sentences) {
    // simple heuristic: capitalized words = characters
    const words = sentence.split(" ");

    for (const w of words) {
      if (/^[A-Z][a-z]+$/.test(w)) {
        characters.add(w);
      }
    }

    // event detection (simple rule-based)
    if (
      sentence.includes("killed") ||
      sentence.includes("found") ||
      sentence.includes("discovered") ||
      sentence.includes("fought")
    ) {
      keyEvents.push(sentence);
    }

    // setting detection
    if (
      sentence.includes("forest") ||
      sentence.includes("castle") ||
      sentence.includes("city") ||
      sentence.includes("kingdom")
    ) {
      setting.add(sentence);
    }
  }

  return {
    characters: Array.from(characters),
    keyEvents,
    setting: Array.from(setting),
    compressedText: `
Characters: ${Array.from(characters).join(", ")}
Events: ${keyEvents.slice(0, 5).join(" | ")}
Settings: ${Array.from(setting).join(" | ")}
    `.trim()
  };
}
```
### upstream/main (Theirs):
```typescript
```


## File: frontend/src/components/ScrollToTopButton.tsx (Conflict 1)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
      className={`
        fixed bottom-24 right-6
        w-14 h-14 rounded-full
        border-none cursor-pointer
        bg-gradient-to-br from-blue-500 to-indigo-500
        text-white text-xl
        flex items-center justify-center
        shadow-[0_4px_15px_rgba(59,130,246,0.4)]
        transition-all duration-300 ease-in-out
        z-[9999]
        ${isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
        }
      `}
```


## File: frontend/src/components/ScrollToTopButton.tsx (Conflict 2)
### HEAD (Ours):
```typescript
        zIndex: 9999,
```
### upstream/main (Theirs):
```typescript
        zIndex: 9980,
```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 1)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript

import { useState, useRef, useEffect } from "react";
```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 2)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
// --- Types ---

```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 3)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
// --- Constants ---
```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 4)
### HEAD (Ours):
```typescript

```
### upstream/main (Theirs):
```typescript

const INFO_CARDS = [
  {
    icon: MapPin,
    label: "Location",
    value: "Remote — Worldwide",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Briefcase,
    label: "Availability",
    value: "Open to freelance",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: MessageCircle,
    label: "Response Rate",
    value: "100% read rate",
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
];

const SOCIAL_LINKS = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/ronisarkarexe",
    color: "hover:bg-slate-700/50 hover:border-slate-500/40 hover:text-white",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/ronisarkarexe",
    color: "hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-400",
  },
  {
    icon: Twitter,
    label: "Twitter / X",
    href: "https://twitter.com/ronisarkarexe",
    color: "hover:bg-sky-500/20 hover:border-sky-500/40 hover:text-sky-400",
  },
  {
    icon: Globe,
    label: "Portfolio",
    href: "https://ronisarkarexe.github.io",
    color: "hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-purple-400",
  },
];

```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 5)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
  required: boolean;
}> = [
  {
    id: "contact-fullname",
    name: "fullname",
    type: "text",
    label: "Full Name",
    placeholder: "Jane Smith",
    icon: User,
    autoComplete: "name",
    required: true,
  },
  {
    id: "contact-email",
    name: "email",
    type: "email",
    label: "Email Address",
    placeholder: "jane@example.com",
    icon: Mail,
    autoComplete: "email",
    required: true,
  },
  {
    id: "contact-subject",
    name: "subject",
    type: "text",
    label: "Subject",
    placeholder: "What's this about?",
    icon: FileText,
    autoComplete: "off",
    required: true,
  },
];
```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 6)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript

const STATS = [
  { value: "24h", label: "Response time" },
  { value: "100%", label: "Read rate" },
  { value: "Open", label: "Source project" },
] as const;

// --- FloatingLabelInput ---
// ΓöÇΓöÇΓöÇ FloatingLabelInput ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

interface FloatingLabelInputProps {
  id: string;
  name: FormField;
  type: string;
  label: string;
  icon: React.ElementType;
  autoComplete: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  required?: boolean;
}

const FloatingLabelInput = ({
  id,
  name,
  type,
  label,
  icon: Icon,
  autoComplete,
  value,
  onChange,
  error = false,
  required = false,
}: FloatingLabelInputProps) => {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className="contact-float-field group">
      <div className="relative">
        {/* Icon */}
        <span
          className={`contact-float-icon ${isFloated ? "contact-float-icon--active" : ""}`}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>

        {/* Input */}
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          autoComplete={autoComplete}
          placeholder=" "
          aria-label={label}
          aria-invalid={error}
          aria-required={required}
          className={[
            "contact-float-input",
            isFloated ? "contact-float-input--active" : "",
            error ? "contact-float-input--error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {/* Floating label with required indicator */}
        <label
          htmlFor={id}
          className={`contact-float-label ${isFloated ? "contact-float-label--floated" : ""}`}
        >
          {label}
          {required && (
            <span className="contact-required-star" aria-hidden="true"> *</span>
          )}
        </label>

        {/* Animated focus underline */}
        <span className="contact-float-underline" aria-hidden="true" />
      </div>

      {/* Inline validation feedback */}
      {error && (
        <p className="contact-field-error-msg" role="alert">
          <AlertCircle className="inline h-3 w-3 mr-1" aria-hidden="true" />
          {name === "email" ? "Please enter a valid email address." : `${label} is required.`}
        </p>
      )}
    </div>
  );
};

// --- FloatingLabelTextarea ---

interface FloatingLabelTextareaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: boolean;
}

}: FloatingLabelInputProps) => {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className="contact-float-field group">
      <div className="relative">
        {/* Icon */}
        <span
          className={`contact-float-icon ${isFloated ? "contact-float-icon--active" : ""}`}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>

        {/* Input */}
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          autoComplete={autoComplete}
          placeholder=" "
          aria-label={label}
          aria-invalid={error}
          className={[
            "contact-float-input",
            isFloated ? "contact-float-input--active" : "",
            error ? "contact-float-input--error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {/* Floating label */}
        <label
          htmlFor={id}
          className={`contact-float-label ${isFloated ? "contact-float-label--floated" : ""}`}
        >
          {label}
        </label>

        {/* Animated focus underline */}
        <span className="contact-float-underline" aria-hidden="true" />
      </div>
    </div>
  );
};

// ΓöÇΓöÇΓöÇ FloatingLabelTextarea ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

interface FloatingLabelTextareaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error?: boolean;
}

const FloatingLabelTextarea = ({
  value,
  onChange,
  error = false,
}: FloatingLabelTextareaProps) => {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div className="contact-float-field group">
      <div className="relative">
        {/* Icon */}
        <span
          className={`contact-float-icon contact-float-icon--textarea ${
            isFloated ? "contact-float-icon--active" : ""
          }`}
          aria-hidden="true"
        >
          <Pencil className="h-4 w-4" />
        </span>

        {/* Textarea */}
        <textarea
          id="contact-message"
          rows={5}
          name="message"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          placeholder=" "
          aria-label="Message"
          aria-invalid={error}
          aria-required="true"
          className={[
            "contact-float-input contact-float-textarea",
            isFloated ? "contact-float-input--active" : "",
            error ? "contact-float-input--error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {/* Floating label with required indicator */}
        <label
          htmlFor="contact-message"
          className={`contact-float-label contact-float-label--textarea ${
            isFloated ? "contact-float-label--floated" : ""
          }`}
        >
          Message
          <span className="contact-required-star" aria-hidden="true"> *</span>
        </label>

        {/* Animated focus underline */}
        <span className="contact-float-underline" aria-hidden="true" />
      </div>

      {error && (
        <p className="contact-field-error-msg" role="alert">
          <AlertCircle className="inline h-3 w-3 mr-1" aria-hidden="true" />
          Message is required.
        </p>
      )}
    </div>
  );
};

// --- Main Contact component ---

  return (
    <div className="contact-float-field group">
      <div className="relative">
        {/* Icon */}
        <span
          className={`contact-float-icon contact-float-icon--textarea ${isFloated ? "contact-float-icon--active" : ""
            }`}
          aria-hidden="true"
        >
          <Pencil className="h-4 w-4" />
        </span>

        {/* Textarea */}
        <textarea
          id="contact-message"
          rows={5}
          name="message"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          placeholder=" "
          aria-label="Message"
          aria-invalid={error}
          className={[
            "contact-float-input contact-float-textarea",
            isFloated ? "contact-float-input--active" : "",
            error ? "contact-float-input--error" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {/* Floating label */}
        <label
          htmlFor="contact-message"
          className={`contact-float-label contact-float-label--textarea ${isFloated ? "contact-float-label--floated" : ""
            }`}
        >
          Message
        </label>

        {/* Animated focus underline */}
        <span className="contact-float-underline" aria-hidden="true" />
      </div>
    </div>
  );
};

// ΓöÇΓöÇΓöÇ Main Contact component ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 7)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
      {/* Layered background */}
```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 8)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
      {/* Page content */}
```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 9)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
            className={`contact-badge inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 10)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
          {/* LEFT COLUMN */}
          <div
            className={`contact-col-left flex flex-col transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 11)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
            {/* Intro description — improved */}
            <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-[1.8] text-slate-400 sm:text-base">
              I'm always open to discussing new ideas, collaborations, freelance
              work, or creative projects. Have a story idea or feature suggestion?
              Drop me a message — I read everything and reply within 24 hours.
            </p>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className="contact-stat-card rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3 text-center sm:p-4"
                  style={{
                    transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
                  }}
                >
                  <p className="text-lg font-black text-white sm:text-xl">{value}</p>
                  <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Info cards grid */}
            <div className="mt-7 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3">
              {INFO_CARDS.map(({ icon: Icon, label, value, color, iconColor }) => (
                <div
                  key={label}
                  className="contact-info-card flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-3 backdrop-blur-sm"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} ${iconColor}`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.6rem] font-bold uppercase tracking-widest text-slate-500">
                      {label}
                    </span>
                    <span className="block truncate text-xs font-semibold text-slate-300">
                      {value}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            {/* Contact channels */}
            <ul className="mt-5 space-y-2.5 sm:mt-6" aria-label="Contact channels">
              {CONTACT_CHANNELS.map(
                ({ icon: Icon, label, value, href, color, iconColor, hoverBorder }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label}: ${value}`}
                      className={`contact-channel-link group flex items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm ${hoverBorder}`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} ${iconColor}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
                          {label}
                        </span>
                        <span className="block truncate text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-200">
                          {value}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 shrink-0 text-slate-600 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-400"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                )
              )}
            </ul>

            {/* Social media links */}
            <div className="mt-6">
              <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
                Find me on
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`contact-social-btn flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-500 transition-all duration-200 ${color}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Heading */}
            <h1
              id="contact-heading"
              className="font-black leading-[0.9] tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="block text-[clamp(2.75rem,6vw,4.5rem)] text-white">
                Let's Start a
              </span>
              <span className="contact-heading-gradient block text-[clamp(2.75rem,6vw,4.5rem)]">
                Conversation
              </span>
            </h1>

            {/* Accent bar */}
            <div aria-hidden="true" className="contact-accent-bar mt-5" />

```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 12)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
          {/* RIGHT COLUMN — FORM */}
          <div
            className={`contact-col-right w-full lg:sticky lg:top-24 transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
```


## File: frontend/src/components/contactus/contactus.tsx (Conflict 13)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript

              <div className="contact-form-card">
                <div aria-hidden="true" className="contact-form-top-line" />

                {/* Form header */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Send a Message
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-400">
                    All fields marked <span className="text-violet-400 font-semibold">*</span> are required. We'll reply within 24 hours.
                  <p className="mt-1.5 text-sm text-slate-500">
                    We'll get back to you within 24 hours.
                  </p>
                </div>

                <form
                  onSubmit={submitHandler}
                  noValidate
                  aria-label="Contact form"
                  className="space-y-5"
                >
                  {/* Floating label text inputs */}
                  {FORM_FIELDS.map(({ id, name, type, label, icon, autoComplete, required }) => (
                  {FORM_FIELDS.map(({ id, name, type, label, icon, autoComplete }) => (
                    <FloatingLabelInput
                      key={id}
                      id={id}
                      name={name}
                      type={type}
                      label={label}
                      icon={icon}
                      autoComplete={autoComplete}
                      value={formData[name]}
                      onChange={changeHandler}
                      error={fieldErrors[name]}
                      required={required}
                    />
                  ))}

                  {/* Floating label textarea */}
                  <FloatingLabelTextarea
                    value={formData.message}
                    onChange={changeHandler}
                    error={fieldErrors.message}
                  />

                  {/* Global error banner */}
                  {error && !Object.values(fieldErrors).some(Boolean) && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3.5 contact-fade-in"
                    >
                      <AlertCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-red-400"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    aria-label={loading ? "Sending message…" : "Send message"}
                    aria-label={loading ? "Sending messageΓÇª" : "Send message"}
                    className="contact-submit-btn group relative mt-1 flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl text-sm font-bold text-white sm:h-[3.125rem] sm:text-base"
                  >
                    <span aria-hidden="true" className="contact-btn-gradient absolute inset-0" />
                    {/* Shimmer sweep on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <span className="relative flex items-center gap-2.5">
                      {loading ? (
                        <>
                          <span
                            aria-hidden="true"
                            className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                          />
                          <span>Sending…</span>
                          <span>SendingΓÇª</span>
                        </>
                      ) : (
                        <>
                          <Send
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                          <span>Send Message</span>
                        </>
                      )}
                    </span>
                  </button>

                  {/* Success */}
                  {success && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-4 contact-fade-in"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-emerald-400">
                          Message sent successfully!
                        </p>
                        <p className="mt-0.5 text-xs text-emerald-500/80">
                          We'll get back to you within 24 hours.
                        </p>
                      </div>
                      className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3.5 animate-fade-in"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium text-emerald-400">
                        Message sent ΓÇö we'll get back to you within 24 hours.
                      </p>
                    </div>
                  )}
```


## File: frontend/src/components/cookie-consent/cookie-consent.component.tsx (Conflict 1)
### HEAD (Ours):
```typescript
    <div ref={bannerRef} className={bannerClasses}>
```
### upstream/main (Theirs):
```typescript
    <div ref={bannerRef} className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-h-[82vh] max-w-5xl flex-col gap-4 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl sm:p-5 xl:flex-row xl:items-start xl:justify-between xl:gap-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Cookie Preferences</p>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Manage your cookie settings</h2>
          <p className="text-sm leading-6 text-slate-300 sm:text-base sm:leading-7"></p>
```


## File: frontend/src/components/cookie-consent/cookie-consent.component.tsx (Conflict 2)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
    </div>
  </div>
```


## File: frontend/src/components/help_center/help_sidebar/help_sidebar.component.tsx (Conflict 1)
### HEAD (Ours):
```typescript
const HelpSidebar: FC = () => {
  const [activeSection, setActiveSection] = useState<string>("categories");
```
### upstream/main (Theirs):
```typescript
const HELP_SECTIONS = [
  { id: "help-categories", label: "Categories", icon: "fa-layer-group", color: "from-blue-500 to-cyan-500" },
  { id: "faq-section", label: "FAQs", icon: "fa-circle-question", color: "from-indigo-500 to-purple-500" },
  { id: "troubleshoot-section", label: "Troubleshooting", icon: "fa-screwdriver-wrench", color: "from-orange-500 to-red-500" },
  { id: "setup-guide-section", label: "Setup Guide", icon: "fa-rocket", color: "from-emerald-500 to-teal-500" },
  { id: "support-links-section", label: "Support", icon: "fa-headset", color: "from-pink-500 to-rose-500" },
];

const HelpSidebar = () => {
  const [activeSection, setActiveSection] = useState<string>(
    HELP_SECTIONS[0]?.id ?? "help-categories"
  );
```


## File: frontend/src/components/help_center/help_sidebar/help_sidebar.component.tsx (Conflict 2)
### HEAD (Ours):
```typescript
    return () => observer.disconnect();
```
### upstream/main (Theirs):
```typescript
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= documentHeight - 120) {
        if (scrollBottom >= documentHeight - 80) {
          setActiveSection("support-links-section");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
```


## File: frontend/src/components/help_center/help_sidebar/help_sidebar.component.tsx (Conflict 3)
### HEAD (Ours):
```typescript
      <nav
        className="hidden lg:block w-56 flex-shrink-0"
        aria-label="Help center sections"
      >
        <div className="sticky top-24 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
            On this page
          </p>
          {HELP_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeSection === section.id
                  ? "bg-indigo-500/20 text-indigo-300 border-l-2 border-indigo-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
              aria-current={activeSection === section.id ? "true" : undefined}
            >
              {section.label}
            </button>
          ))}
```
### upstream/main (Theirs):
```typescript
      <nav className="hidden lg:block w-72 flex-shrink-0" aria-label="Help center sections">
        <div className="sticky top-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-[2rem] border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl shadow-xl px-8 py-6"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 rounded-[2rem] border border-white/30 dark:border-white/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-500/20 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-semibold tracking-wide uppercase text-blue-700 dark:text-blue-300">
                    Quick Navigation
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Help Center</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Navigate through guides, troubleshooting, setup instructions, and support resources.
                </p>
              </div>
            </div>

            {/* Section Buttons */}
            <div className="relative space-y-3">
              {HELP_SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`relative group w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 overflow-hidden border focus:outline-none ${isActive
                      ? "border-blue-300 dark:border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10"
                      : "border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.03] hover:border-blue-200 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="min-w-0 flex-1 flex items-center gap-4">
                        <i className={`fa-solid ${section.icon} text-sm`} aria-hidden="true" />
                        <p className={`font-bold text-xs sm:text-sm tracking-tight transition-colors duration-200 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"}`}>
                          {section.label}
                        </p>
                      </div>

                      <div className="shrink-0">
                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${isActive ? "bg-blue-500 scale-125 shadow-[0_0_8px_rgba(59,130,246,0.6)]" : "bg-slate-300 dark:bg-slate-700"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20"
                          transition={{ type: "spring", stiffness: 260, damping: 24 }}
                        />
                      )}
                      <i className={`fa-solid ${section.icon} text-sm relative z-10 ${isActive ? "text-blue-500" : "text-slate-400"}`} aria-hidden="true" />
                      <div className="relative z-10 flex-1 text-left">
                        <p className={`font-semibold text-sm transition-colors duration-300 ${isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                          {section.label}
                        </p>
                      </div>
                      <div className="relative z-10">
                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isActive ? "bg-blue-500 scale-125 shadow-[0_0_12px_rgba(59,130,246,0.7)]" : "bg-slate-300 dark:bg-slate-700"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              <motion.div
                whileHover={{ y: -2 }}
                className="relative overflow-hidden mt-8 rounded-3xl border border-blue-200 dark:border-indigo-500/20 bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-indigo-500/10 dark:via-blue-500/10 dark:to-slate-900/30 p-6"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                      <i className="fa-solid fa-sparkles text-lg"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white">Need More Help?</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Contact support</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => scrollToSection("support-links-section")}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-500/20"
                >
                  Support Links
                </button>
              </div>
            </motion.div>
          </motion.div>
```


## File: frontend/src/components/help_center/help_sidebar/help_sidebar.component.tsx (Conflict 4)
### HEAD (Ours):
```typescript
        className="lg:hidden sticky top-0 z-20 -mx-4 px-4 py-3 bg-slate-900/90 backdrop-blur-sm border-b border-white/10 mb-8"
        aria-label="Help center sections"
```
### upstream/main (Theirs):
```typescript
        className="lg:hidden sticky top-0 z-20 -mx-4 px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-white/10 mb-8"
        aria-label="Help center sections mobile"
```


## File: frontend/src/components/help_center/help_sidebar/help_sidebar.component.tsx (Conflict 5)
### HEAD (Ours):
```typescript
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeSection === section.id
                  ? "bg-indigo-500/30 text-indigo-200 border border-indigo-500/40"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
              }`}
```
### upstream/main (Theirs):
```typescript
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${activeSection === section.id
                ? "bg-indigo-100 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-500/40"
                : "bg-white dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
```


## File: frontend/src/components/hero/nav_list.component.tsx (Conflict 1)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={toggleGlow}
              className={`group relative grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ${
                glowEnabled
                  ? "border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : "border-slate-200/80 bg-white/60 text-slate-400 hover:text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-500 dark:hover:text-slate-300"
              }`}
              title={glowEnabled ? "Glow: On" : "Glow: Off"}
              aria-label={glowEnabled ? "Disable cursor glow" : "Enable cursor glow"}
              aria-pressed={glowEnabled}
            >
              <Sparkles className="h-[18px] w-[18px]" strokeWidth={2.5} />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 bg-white/60 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
              <ThemeToggle />
            </div>
          </motion.div>

          <div className="hidden items-center gap-2 lg:flex">
            {loggedIn ? (
              <motion.button
                onClick={handleLogout}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="h-10 rounded-full border border-slate-200/80 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Logout
              </motion.button>
            ) : (
              <>
                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    onClick={handleNavClick}
                    className="inline-flex h-10 items-center rounded-full border border-slate-200/80 bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    Login
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Link
                    to="/signup"
                    onClick={handleNavClick}
                    className="group inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:shadow-indigo-600/40"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 bg-white/60 text-slate-700 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:bg-white hover:text-slate-950 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="overflow-hidden border-b border-slate-200/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/85 lg:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 pb-5 pt-2 sm:px-6">
              <div className="space-y-2 rounded-2xl border border-slate-200/70 bg-white/55 p-2 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/[0.04]">
                </div>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={mobileItemVariants}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      onClick={handleNavClick}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive(item.to)
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
                          : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/10"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive(item.to) && <span className="h-2 w-2 rounded-full bg-white/90" />}
                    </NavLink>
                  </motion.div>
                ))}

                {loggedIn && (
                  <motion.div
                    custom={navItems.length}
                    initial="hidden"
                    animate="visible"
                    variants={mobileItemVariants}
                  >
                    <NavLink
                      to="/dashboard"
                      onClick={handleNavClick}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                        isActive("/dashboard")
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
                          : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/10"
                      }`}
                    >
                      <span>Dashboard</span>
                      {isActive("/dashboard") && <span className="h-2 w-2 rounded-full bg-white/90" />}
                    </NavLink>
                  </motion.div>
                )}

                <motion.div
                  custom={navItems.length + 1}
                  initial="hidden"
                  animate="visible"
                  variants={mobileItemVariants}
                  className="grid gap-2 border-t border-slate-200/70 pt-2 dark:border-white/10"
                >
                  {loggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-white/10"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={handleNavClick}
                        className="flex items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={handleNavClick}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      {menuOpen && (
        <div className="space-y-1 border-t border-slate-200/70 px-4 py-3 lg:hidden dark:border-white/10">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/story-inspiration" className={linkClass}>Stories</NavLink>
          <NavLink to="/community" className={linkClass}>Community</NavLink>
        </div>
      )}
    </div>
  </header>
  );
};

export default NavListComponent;
      </AnimatePresence>
```


## File: frontend/src/components/hero/nav_list.component.tsx (Conflict 2)
### HEAD (Ours):
```typescript
export default NavListComponent;
```
### upstream/main (Theirs):
```typescript
export default NavListComponent;
export default NavListComponent;
export default NavList;
export default NavListComponent;
```


## File: frontend/src/components/home/pricing/payment.component.tsx (Conflict 1)
### HEAD (Ours):
```typescript
  // State variables requested by user
  const [loading, setLoading] = useState(false);
```
### upstream/main (Theirs):
```typescript
  // State variables for checkout card details
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 2) return clean;
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
  };

  const isFormValid =
    name.trim() !== "" &&
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvv.length === 3;
```


## File: frontend/src/components/home/writer_feedback/ReviewForm.tsx (Conflict 1)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
const ratingLabels = [
  "",
  "Poor",
  "Fair",
  "Good",
  "Great",
  "Excellent",
];
const StarRating = ({ rating, setRating }: { rating: number; setRating: (n: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        className={`text-2xl transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md ${
          star <= rating ? "text-yellow-400 drop-shadow-sm" : "text-slate-300 dark:text-slate-600"
        }`}
        aria-label={`Rate ${star} star`}
      >
        ★
      </button>
    ))}
  </div>
);
```


## File: frontend/src/components/home/writer_feedback/ReviewForm.tsx (Conflict 2)
### HEAD (Ours):
```typescript
            <div className="flex justify-center mt-6">
```
### upstream/main (Theirs):
```typescript
            <div className="flex justify-center mt-8 pb-2 sm:pb-0">
```


## File: frontend/src/components/home/writer_feedback/ReviewForm.tsx (Conflict 3)
### HEAD (Ours):
```typescript
  </div>
</div>
```
### upstream/main (Theirs):
```typescript
  
</div>
  );
    </div>
```


## File: frontend/src/components/post/post.view.list.component.tsx (Conflict 1)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [readStories, setReadStories] = useState<Record<string, boolean>>(() => {
    const readMap: Record<string, boolean> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("story-read-")) {
          const storyId = key.replace("story-read-", "");
          readMap[storyId] = localStorage.getItem(key) === "true";
        }
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
    return readMap;
  });

  const handleToggleRead = (storyId: string) => {
    setReadStories((prev) => {
      const newValue = !prev[storyId];
      try {
        if (newValue) {
          localStorage.setItem(`story-read-${storyId}`, "true");
        } else {
          localStorage.removeItem(`story-read-${storyId}`);
        }
      } catch (e) {
        console.error("Error updating localStorage", e);
      }
      return { ...prev, [storyId]: newValue };
    });
  };
```


## File: frontend/src/components/post/post.view.list.component.tsx (Conflict 2)
### HEAD (Ours):
```typescript
              <div className="relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                {story.imageURL ? (
```
### upstream/main (Theirs):
```typescript
              <div className="relative overflow-hidden bg-slate-200 dark:bg-slate-800 h-52">
                {!imageErrors[story._id] && story.imageURL ? (
```


## File: frontend/src/components/report-bug/ReportBug.tsx (Conflict 1)
### HEAD (Ours):
```typescript
  FileWarning
```
### upstream/main (Theirs):
```typescript
  FileWarning,
```


## File: frontend/src/components/signup/signup.component.tsx (Conflict 1)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
          
```


## File: frontend/src/components/signup/signup.component.tsx (Conflict 2)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
  const handleGoBack = () => {
    setShowOtpField(false);
  };

  useEffect(() => {
    if (!showOtpField && registerInfo) {
      setValue("name", registerInfo.name);
      setValue("email", registerInfo.email);
      setValue("password", registerInfo.password);
      setValue("confirmPassword", registerInfo.password);
    }
  }, [showOtpField, registerInfo, setValue]);
```


## File: frontend/src/components/stories/stories.component.tsx (Conflict 1)
### HEAD (Ours):
```typescript
import React, { useState, useEffect, useRef, useMemo } from "react";
import StoriesViewComponent, { IStories } from "./stories.view.component";
import RecentPromptsPanel from "./RecentPromptsPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserInfo, isLoggedIn } from "../../services/auth.service";
import { getRequestLimit, getWordCount, prompts } from "./stories.utils";
import {
  useGenerateFreeModelMutation,
  useGenerateModelMutation,
} from "../../redux/apis/ai.model.api";
```
### upstream/main (Theirs):
```typescript
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { getShortenedText, ITopicData, topicsData, getWordCount, SELECTED_TOPIC_CLASSES } from "./stories.utils";
import { formatReadingStats } from "../../utils/story-utils";
```


## File: frontend/src/components/stories/stories.component.tsx (Conflict 2)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
import { useDebounce } from "../../hooks/useDebounce";
import ConfirmDialog from "./ConfirmDialog";
```


## File: frontend/src/components/stories/stories.component.tsx (Conflict 3)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript
const lengths = ["short", "medium", "long"] as const;
const WARN_THRESHOLD = 0.8;
const DANGER_THRESHOLD = 0.95;
```


## File: frontend/src/components/stories/stories.component.tsx (Conflict 4)
### HEAD (Ours):
```typescript
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");

```
### upstream/main (Theirs):
```typescript
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const subscriptionType = (userRole?.subscriptionType as string) || "free";
  const login = isLoggedIn();
  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("all");

  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>(
  draft?.genre
    ? (GENRES.find((g) => g.name === draft.genre || g.value === draft.genre)?.value ?? "ðŸ§™ Fantasy")
    : "ðŸ§™ Fantasy",
);
  const [selectedLength, setSelectedLength] = useState<string>(draft?.length || "medium");
  const [selectedTone, setSelectedTone] = useState<ToneLabel | "">(draft?.tone || "Dramatic");
  const [textareaValue, setTextareaValue] = useState<string>(() => {
    return location.state?.prompt || draft?.prompt || "";
  });
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedLength, setSelectedLength] = useState<string>("medium");
  const [textareaValue, setTextareaValue] = useState<string>("");

  
  const [selectedGenre, setSelectedGenre] = useState<string>(
    draft?.genre
      ? (GENRES.find((g) => g.name === draft.genre || g.value === draft.genre)?.value ?? "🧙 Fantasy")
      : "🧙 Fantasy"
  );
  const [selectedLength, setSelectedLength] = useState<string>(draft?.length || "medium");
  const [selectedTone, setSelectedTone] = useState<ToneLabel | "">(draft?.tone || "Dramatic");
  const [textareaValue, setTextareaValue] = useState<string>(location.state?.prompt || draft?.prompt || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(draft?.language || "English");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [draftStatus, setDraftStatus] = useState("");
  const DRAFT_KEY = "storyspark_story_draft_v1";

  // Custom characters cast setup states:
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSoundtrack = useCallback((genre: string) => {
    const soundtrack = soundtrackMap[genre];

    if (!soundtrack) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showWorldMap, setShowWorldMap] = useState<boolean>(false);
const [, setShowRemix] = useState<boolean>(false);
  const [createPost] = useCreatePostMutation();
  const [deletePost] = useDeletePostMutation();
  const { data: profile } = useGetProfileInfoQuery(undefined, { skip: !isLogin });
  const lastSavedContentRef = useRef<string>("");
  const isSavingRef = useRef<boolean>(false);
  const hasSavedSessionRef = useRef<boolean>(false);
  const savedPostIdRef = useRef<string | null>(null);
  // Alternate ending state & hooks
  const [endingsCache, setEndingsCache] = useState<{
    [uuid: string]: { style: string; ending: string; fullStory: string }[];
  }>({});
  const [originalStoryContent, setOriginalStoryContent] = useState<{
    [uuid: string]: string;
  }>({});
  const [isGeneratingEndings, setIsGeneratingEndings] = useState<boolean>(false);
  const [activeEndingTab, setActiveEndingTab] = useState<string>("Happy Ending");
  const [narrationWordIndex, setNarrationWordIndex] = useState<number>(0);
  const [narrationState, setNarrationState] = useState<NarrationPlaybackState>("idle");

  const [generateAlternateEndings] = useGenerateAlternateEndingsMutation();
  const [generateFreeAlternateEndings] = useGenerateFreeAlternateEndingsMutation();

  useEffect(() => {
    if (selectedStory && !originalStoryContent[selectedStory.uuid]) {
      setOriginalStoryContent((prev) => ({
        ...prev,
        [selectedStory.uuid]: selectedStory.content,
      }));
    }
  }, [selectedStory, originalStoryContent]);

  useEffect(() => {
    if (narrationState === "playing") {
      const activeWordElement = document.querySelector('[data-active-word="true"]');
      if (activeWordElement) {
        activeWordElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest"
        });
      }
    }
  }, [narrationWordIndex, narrationState]);

  const activeGenerationRef = useRef<{ abort: () => void } | null>(null);
  const isGenerationInProgressRef = useRef(false);
  
  const [guestRequestCount, setGuestRequestCount] = useState<number>(() =>
    parseInt(localStorage.getItem("guestRequestCount") || "0", 10)
  );
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [isRecentPromptsOpen, setIsRecentPromptsOpen] = useState<boolean>(false);
  const [isHighLatency, setIsHighLatency] = useState<boolean>(false);
  const { recentPrompts, addPrompt, removePrompt, clearAll } = useRecentPrompts();
  
  const text = UI_TEXT[selectedLanguage] ?? UI_TEXT.English;
  const genreLabels = GENRE_LABELS[selectedLanguage] ?? GENRE_LABELS.English;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleGenerateAlternateEndings = async () => {
    if (!selectedStory) return;
    setIsGeneratingEndings(true);
    const toastId = toast.loading("Generating alternate endings...");
    try {
      const payload = {
        title: selectedStory.title,
        content: originalStoryContent[selectedStory.uuid] || selectedStory.content,
        tag: selectedStory.tag,

        language: selectedStory.language || "English",

      };
      
      const generationRequest = isLogin
        ? generateAlternateEndings(payload)
        : generateFreeAlternateEndings(payload);
        
      const res = await generationRequest.unwrap();
      if (res && res.data) {
        setEndingsCache((prev) => ({
          ...prev,
          [selectedStory.uuid]: res.data,
        }));
        toast.success("Alternate endings generated successfully!");
      } else {
        toast.error("Failed to generate alternate endings.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate alternate endings. Please try again.");
    } finally {
      toast.dismiss(toastId);
      setIsGeneratingEndings(false);
    }
  };

  const handleApplyEnding = (endingData: { style: string; ending: string; fullStory: string }) => {
    if (!selectedStory) return;
    const updatedStory = {
      ...selectedStory,
      content: endingData.fullStory,
    };
    setSelectedStory(updatedStory);
    setStories(
      stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s))
    );
    toast.success(`${endingData.style} applied to story!`);
  };

  const handleResetEnding = () => {
    if (!selectedStory) return;
    const originalContent = originalStoryContent[selectedStory.uuid];
    if (!originalContent) return;
    const updatedStory = {
      ...selectedStory,
      content: originalContent,
    };
    setSelectedStory(updatedStory);
    setStories(
      stories.map((s) => (s.uuid === selectedStory.uuid ? updatedStory : s))
    );
    toast.success("Reverted to original story ending!");
  };

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isPausedAudio, setIsPausedAudio] = useState<boolean>(false);

  // Autosave Draft
  useEffect(() => {
    const timer = setTimeout(() => {
      const draftData = {
        prompt: textareaValue,
        genre: selectedGenre,
        length: selectedLength,
        language: selectedLanguage,
        tone: selectedTone,
      };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      } catch (err) {
        if (err instanceof DOMException && err.name === "QuotaExceededError") {
          toast.error("Couldn't autosave draft — storage limit reached.");
        }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTextToSpeech = () => {
    if (!selectedStory?.content) return;

    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      if (isPausedAudio) {
        window.speechSynthesis.resume();
        setIsPausedAudio(false);
        toast.success("Resumed reading story");
      } else {
        window.speechSynthesis.pause();
        setIsPausedAudio(true);
        toast.success("Paused reading story");
      }
    } else {
      window.speechSynthesis.cancel();
      const cleanContent = selectedStory.content.replace(/<[^>]*>/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanContent);
      
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsPlayingAudio(false);
        setIsPausedAudio(false);
      };

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith("en-") && v.name.includes("Google")
      ) || voices.find((v) => v.lang.startsWith("en-"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      toast.success("Playing story audio");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStopAudio = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    toast.success("Stopped audio playback");
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setSelectTopics(topics.filter((topic) => topic.selected));
  }, [topics]);

  const debouncedSearchQuery = useDebounce(searchQuery, 350);
  const debouncedPrompt = useDebounce(textareaValue, 500);

  const debouncedSearchQuery = useDebounce(searchQuery, 350);
  const debouncedPrompt = useDebounce(textareaValue, 500);

  useEffect(() => {
    setValue("prompt", debouncedPrompt);
  }, [debouncedPrompt, setValue]);
    setNarrationWordIndex(0);
    setNarrationState("idle");
  }, [selectedStory?.uuid]);

  const sentenceSegments = useMemo(() => {
    return buildSentenceSegments(selectedStory?.content ?? "");
  }, [selectedStory?.content]);

  // Sync state instantly whenever a new template is submitted or selected
  useEffect(() => {
    if (stories && stories.length > 0) {
      setSelectedStory(stories[0]);
    } else {
      setSelectedStory(null);
    }
    // Reset auto-save status for new story session
    lastSavedContentRef.current = "";
    hasSavedSessionRef.current = false;
    savedPostIdRef.current = null;
  }, [stories]);

  useEffect(() => {
    const autoSaveStory = async () => {
      // 1. Prevent guest auto-save requests
      if (!isLogin || !selectedStory) return;

      // 2. Prevent duplicate auto-save requests for unchanged story content
      if (selectedStory.content === lastSavedContentRef.current) {
        return;
      }

      // 3. Only one draft/post is created per story session (prevent variation/topic duplicates)
      if (hasSavedSessionRef.current) {
        return;
      }

      // 4. Prevent duplicate network calls while a save is already running
      if (isSavingRef.current) return;

      isSavingRef.current = true;

      const post: IPost = {
        ...selectedStory,
        topic: selectTopics,
      };

      try {
        const result = await createPost(post).unwrap();
        if (result && result.data && result.data._id) {
          savedPostIdRef.current = result.data._id;
        }
        lastSavedContentRef.current = selectedStory.content;
        hasSavedSessionRef.current = true;
        toast.success("Story auto-saved!");
      } catch (error) {
        console.error("Auto-save failed", error);
      } finally {
        isSavingRef.current = false;
      }
    };

    // Debounce to prevent multiple immediate renders/rerenders from triggering save
    const timer = setTimeout(() => {
      autoSaveStory();
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedStory, selectedStory?.content, isLogin, selectTopics, createPost]);

  const handelStorySelection = (story: IStories) => {
    setSelectedStory(story);
  };

  const handleTopicClick = (index: number) => {
    setTopics((currentTopics) =>
      currentTopics.map((topic, topicIndex) =>
        topicIndex === index
          ? { ...topic, selected: !topic.selected }
          : topic
      )
    );
  };
  const handleAddTopic = () => {
    const title = newTopicTitle.trim();

  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const login = isLoggedIn();

  const [generateModel] = useGenerateModelMutation();
  const [generateFreeModel] = useGenerateFreeModelMutation();
  const { data } = useGetProfileInfoQuery(undefined);
  const userRole = getUserInfo();
  const login = isLoggedIn();

  const handleGenerateClick = useCallback(() => {
    if (loading || isOverLimit || !textareaValue.trim()) return;
    if (stories && stories.length > 0) {
      setShowOverwriteConfirm(true);
      return;
    }
    const form = inputRef.current?.closest("form");
    if (form) form.requestSubmit();
  }, [loading, isOverLimit, textareaValue, stories]);

  const handleConfirmOverwrite = useCallback(() => {
    setShowOverwriteConfirm(false);
    const form = inputRef.current?.closest("form");
    if (form) form.requestSubmit();
  }, []);

  const handleCancelOverwrite = useCallback(() => {
    setShowOverwriteConfirm(false);
  }, []);

  const onSubmit: SubmitHandler<Inputs> = useCallback(async (data) => {
    if (isGenerationInProgressRef.current) {
    if (!title) {
      toast.error("Please enter a topic.");
      return;
    }

    const normalizedTitle = title.startsWith("#") ? title : `#${title}`;
    const topicExists = topics.some(
      (topic) => topic.title.toLowerCase() === normalizedTitle.toLowerCase()
    );

    if (topicExists) {
      toast.error("This topic already exists.");
      return;
    }

    setTopics((currentTopics) => [
      ...currentTopics,
      {
        title: normalizedTitle,
        className: SELECTED_TOPIC_CLASSES,
        color: SELECTED_TOPIC_CLASSES,
        selected: true,
      },
    ]);
    setNewTopicTitle("");
  };

  const handleRemoveTopic = (index: number) => {
    if (topics.length <= 2) {
      toast.error("At least 2 topics are required.");
      return;
    }

    setTopics((currentTopics) =>
      currentTopics.filter((_, topicIndex) => topicIndex !== index)
    );
  };
  const handleCopyStory = async () => {
    if (selectedStory?.content) {
      await navigator.clipboard.writeText(selectedStory.content);
      setIsCopied(true);
      toast.success("Story copied!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

    if (getWordCount(data.prompt) < 10) {
      toast.error("Please enter a prompt with at least 10 words to generate a story.");
      toast.error(
        "Please enter a prompt with at least 10 words to generate a story."
      );
      return;
    }
  const handleExportPDF = async () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    if (!selectedStory.content?.trim()) {toast.error("Story content is empty. Cannot export.");return;}
    const toastId = toast.loading("Preparing your premium PDF...");

    try {
      // Helper to load image assets asynchronously with a safe timeout
      const loadImageWithTimeout = (src: string, timeoutMs: number = 3000): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          const timeout = setTimeout(() => {
            img.src = ""; // stop loading
            reject(new Error(`Timeout loading image: ${src}`));
          }, timeoutMs);

          img.onload = () => {
            clearTimeout(timeout);
            resolve(img);
          };
          img.onerror = (e) => {
            clearTimeout(timeout);
            reject(e);
          };
          img.src = src;
        });
      };

      let logoImg: HTMLImageElement | null = null;
      let storyImg: HTMLImageElement | null = null;

      try {
        logoImg = await loadImageWithTimeout(logo);
      } catch (err) {
        console.warn("Failed to load StorySparkAI logo for PDF", err);
      }

      if (selectedStory.imageURL) {
        try {
          storyImg = await loadImageWithTimeout(selectedStory.imageURL);
        } catch (err) {
          console.warn("Failed to load story banner image for PDF", err);
        }
      }

      // Initialize A4 PDF document (210mm x 297mm)
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const title = selectedStory.title || "Untitled Story";
      const content = selectedStory.content || "";
      const tag = (selectedStory.tag || "STORY").toUpperCase();

      const leftMargin = 20;
      const rightMargin = 20;
      const topMargin = 20;
      const bottomMargin = 20;
      const printableWidth = 210 - leftMargin - rightMargin; // 170 mm
      const maxY = 297 - bottomMargin - 10; // Bottom boundary (267mm) leaving room for footer

      let yCursor = topMargin;

      // 1. Header (Logo & Sub-header)
      if (logoImg) {
        const logoHeight = 8;
        const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
        doc.addImage(logoImg, "PNG", leftMargin, yCursor, logoWidth, logoHeight);
      } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(99, 102, 241); // Brand Indigo
        doc.text("StorySparkAI", leftMargin, yCursor + 6);
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text("PREMIUM AI GENERATED STORY", 190, yCursor + 5, { align: "right" });

      yCursor += 10;

    try {
      timeoutId = setTimeout(() => {
        if (isGenerationInProgressRef.current) {
          toast.error("Story generation timed out. Please try again.");
          handleCancelGeneration(true);
        }
      }, 60000);
      // Header Divider Line
      doc.setDrawColor(99, 102, 241); // Brand Indigo
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yCursor, 190, yCursor);

      yCursor += 8;

      const payload = {
        prompt: selectedGenre ? `[Genre: ${selectedGenre}] ${data.prompt}` : data.prompt,
        wordLength: selectedLength === "short" ? 175 : selectedLength === "long" ? 800 : 450,
        prompt: selectedGenre
          ? `[Genre: ${selectedGenre}] ${data.prompt}`
          : data.prompt,
        wordLength:
          selectedLength === "short"
            ? 175
            : selectedLength === "long"
            ? 800
            : 450,
        language: selectedLanguage,
        tone: selectedTone || undefined,
        characters: characters.map(({ name, role, personality }) => ({ name, role, personality })),
      };

      const generationRequest = login ? generateModel(payload) : generateFreeModel(payload);
      const generationRequest = login
        ? generateModel(payload)
        : generateFreeModel(payload);
      activeGenerationRef.current = generationRequest;
      const res = await generationRequest.unwrap();
      if (res) {
        toast.success(res.message);
        addPrompt(data.prompt);
        setStories(getUniqueStories(res.data as IStories[]));
        setTextareaValue("");
        setSelectedPrompt("");
        setValue("prompt", "");
        // Clear draft after successful generation
        localStorage.removeItem(DRAFT_KEY);
        setDraftStatus("");
        reset();
        setCharacters([]);
        setCurrentStep(1);
        if (selectedGenre) {
          playSoundtrack(selectedGenre);
      // 2. Story Banner Image (only on Page 1)
      if (storyImg) {
        const bannerHeight = 55;
        doc.addImage(storyImg, "JPEG", leftMargin, yCursor, printableWidth, bannerHeight);
        yCursor += bannerHeight + 8;
      }

      // 3. Story Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59); // Slate 800
      const splitTitle = doc.splitTextToSize(title, printableWidth);
      splitTitle.forEach((line: string) => {
        doc.text(line, leftMargin, yCursor);
        yCursor += 9;
      });

      yCursor += 1;

      // 4. Meta Row (Generated Date & Genre Pill Badge)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139); // Slate 500
      const formattedDate = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Generated on ${formattedDate}`, leftMargin, yCursor);

      // Genre pill badge on the right
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      const tagWidth = doc.getTextWidth(tag);
      const chipWidth = tagWidth + 5;
      const chipHeight = 5;
      const chipX = 190 - chipWidth;
      const chipY = yCursor - 3.8;

      doc.setFillColor(99, 102, 241); // Brand Indigo background
      doc.roundedRect(chipX, chipY, chipWidth, chipHeight, 1, 1, "F");

      doc.setTextColor(255, 255, 255); // White text inside pill
      doc.text(tag, chipX + 2.5, chipY + 3.5);

      yCursor += 4.5;

      // Meta row bottom line
      doc.setDrawColor(226, 232, 240); // Slate 200
      doc.setLineWidth(0.2);
      doc.line(leftMargin, yCursor, 190, yCursor);

      yCursor += 10;

      // 5. Story Paragraphs Flowing
      const paragraphs = content.split(/\n+/);
      const lineHeight = 6.5;
      const paragraphSpacing = 4.5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59); // Slate 800

      paragraphs.forEach((para: string, pIdx: number) => {
        const cleanPara = para.trim();
        if (!cleanPara) return;

        const lines = doc.splitTextToSize(cleanPara, printableWidth);
        lines.forEach((line: string) => {
          if (yCursor > maxY) {
            doc.addPage();
            yCursor = 30; // Top padding for subsequent pages
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.setTextColor(30, 41, 59); // Slate 800
          doc.text(line, leftMargin, yCursor);
          yCursor += lineHeight;
        });

        if (pIdx < paragraphs.length - 1) {
          yCursor += paragraphSpacing;
        }
      });

      // 6. Running Header and Footer generation
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Footer line
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.25);
        doc.line(leftMargin, 280, 190, 280);

        // Footer Text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139); // Slate 500
        doc.text("Generated with StorySparkAI", leftMargin, 285);
        doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });

        // Header on pages 2+
        if (i > 1) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.setTextColor(99, 102, 241); // Brand Indigo
          doc.text("StorySparkAI", leftMargin, 14);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184); // Slate 400
          const headerTitle = title.length > 50 ? title.substring(0, 50) + "..." : title;
          doc.text(headerTitle, 190, 14, { align: "right" });

          doc.setDrawColor(241, 245, 249);
          doc.setLineWidth(0.2);
          doc.line(leftMargin, 17, 190, 17);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (message !== "Story generation was cancelled.") {
        toast.error(message);
      }
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (latencyTimeoutId) {
        clearTimeout(latencyTimeoutId);
      }
      activeGenerationRef.current = null;
      isGenerationInProgressRef.current = false;
      setLoading(false);
      setIsHighLatency(false);
    }
  }, [
    login,
    guestRequestCount,
    selectedGenre,
    selectedLength,
    selectedLanguage,
    selectedTone,
    generateModel,
    generateFreeModel,
    addPrompt,
    setValue,
    playSoundtrack,
    handleCancelGeneration,
    characters,
    reset,
  ]);

  const isOverLimit = textareaValue.length >= MAX_PROMPT_LENGTH;
  const isDangerLimit = textareaValue.length >= MAX_PROMPT_LENGTH * DANGER_THRESHOLD;
  const isNearLimit = textareaValue.length >= MAX_PROMPT_LENGTH * WARN_THRESHOLD && !isDangerLimit;

  const isGenerateDisabled = loading || isOverLimit || !textareaValue.trim();

  const handleOpenHelp = useCallback(() => setShowHelpModal(true), []);
  const handleCloseHelp = useCallback(() => setShowHelpModal(false), []);
  const handleGenerateShortcut = useCallback(() => {
    if (isGenerateDisabled) {
      return;
    }
    if (inputRef.current) {
      const form = inputRef.current.closest("form");
      if (form) form.requestSubmit();
    }
  }, [isGenerateDisabled]);

  const handlePublishShortcut = useCallback(() => {
    const publishBtn = document.getElementById("publish-story-btn");
    publishBtn?.click();
  }, []);

  const handleFocusPrompt = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const generateId = () => Math.random().toString(36).substring(2, 9);
      }

      // Save PDF with sanitized name
      const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      doc.save(`${safeTitle}.pdf`);
      toast.dismiss(toastId);
      toast.success("Premium PDF downloaded!");
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Failed to export PDF.");
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const getSafeFileName = (title: string, ext: string) => {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${cleanTitle || "story"}.${ext}`;
};

const handleExportMarkdown = () => {
    if (!selectedStory) { toast.error("No story available to export."); return; }
    if (!selectedStory.content?.trim()) {toast.error("Story content is empty. Cannot export.");return;}
    try {
      const title = selectedStory.title || "Story";
      const content = selectedStory.content || "";
      const tag = selectedStory.tag || "General";
      const authorName = isLogin && profile?.name ? profile.name : "Anonymous";
      const isoDate = new Date().toISOString().split("T")[0];
      const markdownContent = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ntag: "${tag.replace(/"/g, '\\"')}"\nauthor: "${authorName.replace(/"/g, '\\"')}"\ndate: "${isoDate}"\n---\n\n# ${title}\n\n${content}\n`;
      const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
      downloadBlob(blob, getSafeFileName(title, "md"));
      toast.success("Markdown downloaded!");
    } catch (error) { console.error(error); toast.error("Failed to export Markdown."); }
  };

  const handelPublishStory = async () => {
    if (!isLogin) {
      toast.error("Please login to publish the story.");
      return;
    }
    if (!selectedStory) {
      toast.error("No story available. Please generate a story first.");
      return;
    }
    if (selectTopics.length < 2) {
      toast.error("Please select at least 2 topics.");
      return;
    }
    const post: IPost = {
      ...selectedStory,
      topic: selectTopics,
    };
    setLoading(true);
    try {
      if (savedPostIdRef.current) {
        try {
          await deletePost(savedPostIdRef.current).unwrap();
        } catch (deleteError) {
          console.warn("Failed to delete auto-saved draft before publishing:", deleteError);
        }
      }
      const result = await createPost(post).unwrap();
      if (result) {
        toast.success("Story published successfully!");
        setStories([]);
        setSelectedStory(null);
        onPublishSuccess?.();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingTime = (content: string): number => {
    const words = getWordCount(content);
    return Math.max(1, Math.ceil(words / 200));
  };

  const isNarrationActive = narrationState !== "idle";


  const uniqueStories = useMemo(() => getUniqueStories(stories), [stories]);

```


## File: frontend/src/components/stories/stories.component.tsx (Conflict 5)
### HEAD (Ours):
```typescript
  // Autosave Draft
  useEffect(() => {
    const timer = setTimeout(() => {
      // stories intentionally excluded â€” API response, not user input
      // including stories risks hitting localStorage quota (~5MB) silently
      const draftData = {
        prompt: textareaValue,
        genre: selectedGenre,
        length: selectedLength,
        language: selectedLanguage,
        tone: selectedTone,
        stories: stories,
      };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      } catch (err) {
        if (err instanceof DOMException && err.name === "QuotaExceededError") {
          toast.error("Couldn't autosave draft â€” storage limit reached.");
        }
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [textareaValue, selectedGenre, selectedLength, selectedLanguage, selectedTone, stories]);

  useEffect(() => {
    const selectedLocale =
      LANGUAGES.find((language) => language.name === selectedLanguage)?.code ?? "en";
    localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
    document.documentElement.lang = selectedLocale;
  }, [selectedLanguage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
useEffect(() => {
  if (location.state) {
    if (location.state.prompt) {
      setTextareaValue(location.state.prompt);
    }

    if (location.state.genre) {
  const matchedGenre =
    GENRES.find((g) => g.name === location.state.genre)?.value ?? "";
  setSelectedGenre(matchedGenre);
```
### upstream/main (Theirs):
```typescript
if (isLoading) {
  return (
    <div className="bg-gradient-to-br animate-gradient-slow min-h-screen relative overflow-x-hidden">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          <div className="pt-2 w-full md:w-auto flex justify-start">
            <Link to="/">
              <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap">
                <i className="fa-solid fa-left-long"></i> BACK
              </div>
            </Link>
          </div>

          {!login && (
            <div className="pt-2 text-center">
              <div className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 text-gray-400 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded text-sm whitespace-normal md:whitespace-nowrap leading-relaxed">
                <span>
                  Free access for 3 requests — <Link to="/login"><span className="text-indigo-400 underline font-semibold">Login</span></Link> for more!
    <div className="flex items-center justify-center py-20">
      <StoryGeneratingAnimation />
    </div>
  );
```


## File: frontend/src/components/stories/stories.component.tsx (Conflict 6)
### HEAD (Ours):
```typescript
            </Link>
```
### upstream/main (Theirs):
```typescript
            </div>
          )}

          <div className="flex flex-col items-center md:items-end pt-2 w-full md:w-auto">
            <button className="!rounded-button bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-gray-300 px-3 py-2 flex items-center gap-2 transition-all duration-300 rounded whitespace-nowrap">
              <span>
                <span className="text-gray-400 text-xs mr-1">Per Month</span>
                {getRequestLimit(subscriptionType)}
              </span>
              <Link to="/pricing" className="border-1 border-white/20 pl-2 text-gray-300">
               Upgrade
              </Link>
              
              <i className="fas fa-bolt text-yellow-400"></i>
            </button>
            <div className="mt-3 text-gray-500 text-xs text-center md:text-right">
              <span>
                This month request:{" "}
                {login ? (data?.requestsThisMonth ?? 0) : guestRequestCount}
              </span>
              <br />
              <span>Total posts: {login ? (data?.postsCount ?? 0) : 0}</span>
            <div className="flex justify-start sm:justify-end">
              <div className="flex -space-x-5">
                {stories && stories.length > 0 && (
                  stories.map((story) => (
                    <button
                      key={story.uuid}
                      className={`relative w-16 h-16 rounded-full border-2 ${
                        selectedStory?.uuid === story.uuid
                          ? "border-blue-500 scale-110"
                          : "border-white"
                      } hover:scale-110 transition-transform duration-200 focus:outline-none`}
                      onClick={() => handelStorySelection(story)}
                    >
                      <img
                        src={story.imageURL}
                        alt={story.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </button>
                  ))
                )}
              </div>
            </div>
```


## File: frontend/src/components/stories/stories.component.tsx (Conflict 7)
### HEAD (Ours):
```typescript
                          if (isGenerateDisabled) {
                            return;
                          }
                          const form = e.currentTarget.closest("form");
                          if (form) form.requestSubmit();
```
### upstream/main (Theirs):
```typescript
                          handleNextStep();
                          return;
                        }

                        // Ctrl/Cmd + Enter -> generate story (only when prompt editor is focused)
                        const isMac =
                          typeof navigator !== "undefined" &&
                          navigator.platform.toUpperCase().includes("MAC");
                        const shouldTrigger = isMac ? e.metaKey : e.ctrlKey;

                        if (
                          e.key === "Enter" &&
                          shouldTrigger &&
                          !e.shiftKey &&
                          !loading &&
                          !isOverLimit &&
                          textareaValue.trim().length > 0
                        ) {
                          e.preventDefault();

                          // Prevent duplicate requests while generation is already in progress
                          if (isGenerationInProgressRef.current) return;

                          handleGenerateClick();
```


## File: frontend/src/components/stories/stories.component.tsx (Conflict 8)
### HEAD (Ours):
```typescript
                            disabled={loading}
                            onClick={() => setSelectedTone("")}
                            className={`ml-1 text-gray-500 transition-colors ${
                              loading
                                ? "cursor-not-allowed opacity-50"
                                : "hover:text-red-400"
```
### upstream/main (Theirs):
```typescript
                            onClick={() => handleRemoveCharacter(char.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>

    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="text-xs text-gray-400 mr-1">📏 Length:</span>

      {lengths.map((length) => (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Name</label>
                            <input
                              type="text"
                              value={char.name}
                              onChange={(e) => handleCharacterChange(char.id, "name", e.target.value)}
                              placeholder="e.g. Leo, Sir Cedric, Bella"
                              className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-blue-500/40 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 placeholder:italic"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Role</label>
                            <select
                              value={char.role}
                              onChange={(e) => handleCharacterChange(char.id, "role", e.target.value)}
                              className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-blue-500/40 text-slate-800 dark:text-slate-200"
                            >
                              <option value="Protagonist">Protagonist (Hero/Main Character)</option>
                              <option value="Companion">Companion (Sidekick/Friend)</option>
                              <option value="Rival">Rival (Competitor)</option>
                              <option value="Antagonist">Antagonist (Villain/Obstacle)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Personality & Traits</label>
                          <textarea
                            value={char.personality}
                            onChange={(e) => handleCharacterChange(char.id, "personality", e.target.value)}
                            placeholder="e.g. Brave but clumsy, loves eating carrots, afraid of the dark..."
                            rows={2}
                            className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl outline-none resize-none focus:border-blue-500/40 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 placeholder:italic"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-start select-none">
                    <button
                      type="button"
                      onClick={handleAddCharacter}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:border-white/5 dark:text-slate-400 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
                    >
                      <i className="fas fa-plus" />
                      <span>Add Another Character</span>
                    </button>
                  </div>
                {isGeneratingEndings ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <p className="text-slate-300 text-sm font-medium animate-pulse">
                      Generating alternate endings...
                    </p>
                  </div>
                ) : endingsCache[selectedStory.uuid]?.length > 0 ? (
                  <div>
                    {/* Tabs */}
                    <div className="flex border-b border-slate-700/50 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
                      {[
                        { name: "Happy Ending" },
                        { name: "Dark Ending" },
                        { name: "Plot Twist Ending" },
                        { name: "Open Ending" },
                        { name: "Cliffhanger Ending" }
                      ].map((s) => {
                        const hasEndings = endingsCache[selectedStory.uuid] || [];
                        const endingData = hasEndings.find((e) => e.style === s.name);
                        const isApplied = endingData && selectedStory.content === endingData.fullStory;
                        
                        return (
                          <button
                            key={s.name}
                            type="button"
                            onClick={() => setActiveEndingTab(s.name)}
                            className={`px-5 py-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                              activeEndingTab === s.name
                                ? "border-purple-500 text-purple-400 bg-purple-500/5"
                                : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700"
```


## File: frontend/src/components/stories/stories.component.tsx (Conflict 9)
### HEAD (Ours):
```typescript
```
### upstream/main (Theirs):
```typescript

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Clear prompt button - next to language selector */}
      {textareaValue.length > 0 && (
        <button
          type="button"
          onClick={handleClearPrompt}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 border border-red-500/20"
          aria-label={text.close}
          title="Clear prompt"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
    {showRestorePrompt && (
  <div className="mb-3 p-3 rounded-lg border border-indigo-500/40 bg-indigo-500/10">
    <p className="text-sm text-gray-300 mb-2">
      📄 A previously saved draft was found. Restore it?
    </p>

    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleRestoreDraft}
        className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
      >
        Restore
      </button>

      <button
        type="button"
        onClick={handleDiscardDraft}
        className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
      >
        Discard
      </button>
    </div>
  </div>
)}
    <div className="relative">
      <textarea
  {...register("prompt")}
  ref={(el) => {
    register("prompt").ref(el);
    inputRef.current = el;
  }}
        className={`w-full h-32 sm:h-40 resize-none border-none outline-none bg-transparent text-gray-800 dark:text-gray-200 focus:ring-0 text-lg leading-relaxed tracking-wide placeholder:italic placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-4 transition-colors duration-200 ${
          isOverLimit || isDangerLimit
            ? "ring-1 ring-red-500 rounded"
            : isNearLimit
            ? "ring-1 ring-yellow-400 rounded"
            : ""
        }`}
        placeholder={text.promptPlaceholder}
        value={textareaValue}
        maxLength={MAX_PROMPT_LENGTH}
        onChange={(e) => {
          setTextareaValue(e.target.value);
          if (validationError) {
            setValidationError("");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleGenerateClick();
          }
        }}
        />


      <div className="flex items-center justify-between mt-1 px-1">
        {validationError ? (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> {validationError}
          </p>
        ) : isOverLimit ? (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> Character limit reached — generate is disabled
          </p>
        ) : isNearLimit ? (
          <p className="text-xs text-yellow-400 flex items-center gap-1">
            <span>⚠</span>{" "}
            {MAX_PROMPT_LENGTH - textareaValue.length} characters remaining
          </p>
        ) : (
          <span />
        )}

        <span
          className={`text-xs tabular-nums ml-auto ${
            isOverLimit || isDangerLimit
              ? "text-red-400 font-medium"
              : isNearLimit
              ? "text-yellow-400"
              : "text-gray-500"
          }`}
        >
          {textareaValue.length} / {MAX_PROMPT_LENGTH}
        </span>
      </div>
    </div>
    

{draftStatus && (
   <p className="text-xs text-green-500 mt-2 px-1">
    💾 {draftStatus}
   </p>
)}
    
    <p className="text-xs text-gray-500 mt-1 px-1">
      💡  <span className="font-medium">Keyboard tip:</span> Press{" "}
      <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
        Enter
      </kbd>{" "}
      to generate &bull;{" "}
      <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
        Ctrl + Enter
      </kbd>{" "}
      also works &bull;{" "}
      <kbd className="px-1 py-0.5 text-xs bg-gray-700 rounded border border-gray-600">
        Shift + Enter
      </kbd>{" "}
      for new line
    </p>

    <div className="flex justify-end mt-2 w-full">
      <button
        type="submit"
        disabled={isGenerateDisabled}
        disabled={loading || isOverLimit}
        className={`w-full sm:w-auto justify-center rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-gray-200 px-6 py-3 font-semibold ${
        aria-busy={loading}
        aria-disabled={loading || isOverLimit}
        onClick={handleGenerateClick}
        aria-disabled={isGenerateDisabled}
        className={`rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 text-gray-200 px-6 py-3 font-semibold ${
          isGenerateDisabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
        } transition-all duration-300 transform flex items-center space-x-2 group`}
      >
        <i className="fas fa-wand-magic-sparkles text-xl transition-transform duration-300 group-hover:animate-wiggle"></i>
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  </form>
</div>
```


## File: frontend/src/components/stories/stories.component.tsx (Conflict 10)
### HEAD (Ours):
```typescript
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3 bg-slate-800 text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between text-sm text-left transition-all duration-200"
```
### upstream/main (Theirs):
```typescript
                  disabled={loading || isOverLimit}
                  aria-busy={loading}
                  aria-disabled={loading || isOverLimit}
                  onClick={handleGenerateClick}
                  className={`w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-xl shadow-md shadow-blue-500/10 transition-all duration-150 active:scale-[0.98] select-none uppercase tracking-wider flex items-center justify-center gap-2 ${
                    loading || isOverLimit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  } group`}
```


## File: frontend/src/components/stories/stories.component.tsx (Conflict 11)
### HEAD (Ours):
```typescript
export default StoriesComponent;
```
### upstream/main (Theirs):
```typescript
export default StoriesViewComponent;

```


## File: frontend/src/components/stories/stories.view.component.tsx (Conflict 1)
### HEAD (Ours):
```typescript
                  ≡ƒÄ¡ {selectedStory.tag}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 py-1 px-3 text-xs font-semibold">
                  ≡ƒîÉ {selectedStory.language || "English"}
```
### upstream/main (Theirs):
```typescript
                🎭 {selectedStory.tag}
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 py-1 px-3 text-xs font-semibold">
                🌐 {selectedStory.language || "English"}
```


## File: frontend/src/components/stories/stories.view.component.tsx (Conflict 2)
### HEAD (Ours):
```typescript
                    ≡ƒÿè {selectedStory.emotions.join(", ")}
```
### upstream/main (Theirs):
```typescript
                    💫 {selectedStory.emotions.join(", ")}
```


## File: frontend/src/components/stories/stories.view.component.tsx (Conflict 3)
### HEAD (Ours):
```typescript
                  {isCopied ? "✓ Copied" : "📋 Copy"}
```
### upstream/main (Theirs):
```typescript
                  {isCopied ? "✔ Copied" : "📋 Copy"}
```


## File: frontend/src/components/stories/stories.view.component.tsx (Conflict 4)
### HEAD (Ours):
```typescript
                  ⬇️ Export as Markdown
```
### upstream/main (Theirs):
```typescript
                  ✏️ Export as Markdown
```


## File: frontend/src/components/stories/stories.view.component.tsx (Conflict 5)
### HEAD (Ours):
```typescript
                  ≡ƒù║∩╕Å World Map
```
### upstream/main (Theirs):
```typescript
                 🗺️ World Map
```


## File: frontend/src/components/stories/stories.view.component.tsx (Conflict 6)
### HEAD (Ours):
```typescript
                  ≡ƒöÇ Remix
```
### upstream/main (Theirs):
```typescript
                  ✦ Continue Story
```


## File: frontend/src/components/stories/stories.view.component.tsx (Conflict 7)
### HEAD (Ours):
```typescript
                      ≡ƒîÉ {(selectedStory.language || "English").toUpperCase()}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-slate-700 py-1 px-2.5 text-xs font-medium text-slate-300 shadow-sm gap-1">
                      ΓÅ▒∩╕Å {calculateReadingTime(selectedStory.content)} min read
```
### upstream/main (Theirs):
```typescript
                    🌐 {(selectedStory.language || "English").toUpperCase()}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-slate-700 py-1 px-2.5 text-xs font-medium text-slate-300 shadow-sm gap-1">
                    ⏱️ {calculateReadingTime(selectedStory.content)} min read
```


## File: frontend/src/main.tsx (Conflict 1)
### HEAD (Ours):
```typescript
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


```
### upstream/main (Theirs):
```typescript
const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
```
