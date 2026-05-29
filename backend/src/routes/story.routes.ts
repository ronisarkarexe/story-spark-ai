import express from "express";

const router = express.Router();

router.post("/continue", async (req: any, res: any) => {
  try {
    const { prompt } = req.body;
    const generatedText = "This is the generated continuation chapter.";
    res.json({ text: generatedText });
  } catch (error) {
    res.status(500).json({ error: "Failed to continue story" });
  }
});

router.post("/create", async (req: any, res: any) => {
  try {
    console.log("Data received:", req.body);
    res.status(201).json({ message: "Review submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save" });
  }
});

export const StoryRoutes = router;
