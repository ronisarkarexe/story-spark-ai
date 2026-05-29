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
// Add this new route to handle reviews
// Since app.ts already adds "/review", the full path becomes "/review/create"
router.post("/create", async (req, res) => {
    try {
        console.log("Data received:", req.body);
        res.status(201).json({ message: "Review submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save" });
    }
});

export default router;