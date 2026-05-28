import express from "express";

const router = express.Router();

router.post("/continue", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Replace this with existing AI generation logic
    const generatedText =
      "This is the generated continuation chapter.";

    res.json({
      text: generatedText,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to continue story",
    });
  }
});

export default router;