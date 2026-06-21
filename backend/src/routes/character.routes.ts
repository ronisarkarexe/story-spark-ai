import { Router } from 'express';
import {
  createCharacter,
  getCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
} from '../controllers/character.controller';
import auth from '../app/middleware/auth.middleware';
import { ENUM_USER_ROLE } from '../enums/user';

const characterRouter = Router();

characterRouter.post('/', auth(ENUM_USER_ROLE.USER), createCharacter);
characterRouter.get('/', auth(ENUM_USER_ROLE.USER), getCharacters);
characterRouter.get('/:id', auth(ENUM_USER_ROLE.USER), getCharacterById);
characterRouter.put('/:id', auth(ENUM_USER_ROLE.USER), updateCharacter);
characterRouter.delete('/:id', auth(ENUM_USER_ROLE.USER), deleteCharacter);

export default characterRouter;