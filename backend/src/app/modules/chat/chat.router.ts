import express from 'express';
import { generateResponse } from './chat.controller';

const router = express.Router();

router.post('/ask', generateResponse);

export const ChatRouter = router;