import express, { Request, Response } from "express";

const router = express.Router();

router.post("/continue", async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    // Replace this with existing AI generation logic
    const generatedText = "This is the generated continuation chapter.";

    res.json({
      text: generatedText,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to continue story",
    });
  }
});

// Since app.ts already adds "/review", the full path becomes "/review/create"
router.post("/create", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Data received:", req.body);
    res.status(201).json({ message: "Review submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save" });
  }
});

export default router;