import OpenAI from "openai";
import config from "../../../config";
import { fetchImageURL } from "../../../utils/image_generation";

const openai = new OpenAI({
  apiKey: config.openai_key || "dummy_key",
});

export async function generateStories(prompt: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a creative writer. Generate a JSON array of stories. Each story should have a title, content (around 400 words), and a tag. Format the output as a JSON array.",
      },
      {
        role: "user",
        content: `Generate 4 different stories based on the following prompt: ${prompt}. Each story should have a title, content, and a tag. Return the output as a JSON array.`,
      },
    ],
    response_format: { type: "json_object" },
  });
  const stories = JSON.parse(
    completion.choices[0].message.content as string
  ).stories;
  for (const story of stories) {
    story.imageURL = await fetchImageURL(story.tag);
  }
  return stories;
}
