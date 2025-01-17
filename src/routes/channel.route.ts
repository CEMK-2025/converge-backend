import express from 'express';
import { createChannel, joinChannel } from '../controllers/channel.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/:workspaceId/channels', authenticate, createChannel);

router.post('/:workspaceId/channels/:channelId/join', authenticate, joinChannel);

export default router;
