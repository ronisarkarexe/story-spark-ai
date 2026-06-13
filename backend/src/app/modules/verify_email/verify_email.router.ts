import express from 'express';

const router = express.Router();

// Dummy route to prevent Express from crashing
router.post('/', (req, res) => {
  res.send('Email verification bypassed');
});

export const VerifyEmailRoutes = router;