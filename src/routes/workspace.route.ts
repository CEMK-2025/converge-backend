import { Router } from 'express';
import { createWorkspace } from '../controllers/workspace.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/create', authenticate, createWorkspace);

export default router;
