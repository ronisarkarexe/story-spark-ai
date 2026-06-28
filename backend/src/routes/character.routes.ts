import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  createCharacter,
  getCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
} from '../controllers/character.controller';
import auth from '../app/middleware/auth.middleware';
import { ENUM_USER_ROLE } from '../enums/user';

// ✅ Add rate limiter
const characterRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

const characterRouter = Router();

// ✅ Apply rate limiter to all routes
characterRouter.post('/', characterRateLimiter, auth(ENUM_USER_ROLE.USER), createCharacter);
characterRouter.get('/', characterRateLimiter, auth(ENUM_USER_ROLE.USER), getCharacters);
characterRouter.get('/:id', characterRateLimiter, auth(ENUM_USER_ROLE.USER), getCharacterById);
characterRouter.put('/:id', characterRateLimiter, auth(ENUM_USER_ROLE.USER), updateCharacter);
characterRouter.delete('/:id', characterRateLimiter, auth(ENUM_USER_ROLE.USER), deleteCharacter);

export default characterRouter;