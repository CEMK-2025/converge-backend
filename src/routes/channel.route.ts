import express from 'express';
import { createChannel, joinChannel } from '../controllers/channel.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/workspaces/:workspaceId/channels', authenticate, createChannel);

router.post('/workspaces/:workspaceId/channels/:channelId/join', authenticate, joinChannel);

export default router;
