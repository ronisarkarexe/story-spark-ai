import express from "express";

const router = express.Router();

router.post("/continue", async (req, res) => {
  try {
    const { prompt } = req.body;

    const generatedText = "This is the generated continuation chapter.";

    return res.json({
      text: generatedText,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to continue story",
    });
  }
});

/**
 * CREATE REVIEW
 */
router.post("/create", async (req, res) => {
  try {
    // FIX: removed unsafe request body logging
    // console.log("Data received:", req.body);

    return res.status(201).json({
      message: "Review submitted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to save",
    });
  }
});

export default router;
