import { Router } from 'express';
import { validateContactBody } from './contact.validation';
import { handleContactForm } from './contact.controller';

const contactRouter = Router();
contactRouter.post('/', validateContactBody, handleContactForm);
export default contactRouter;
