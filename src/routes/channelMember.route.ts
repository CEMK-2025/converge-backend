import express from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { getChannelMembers, removeChannelMember, updateChannelMemberRole } from '../controllers/channelMemeber.controller';
import { isWorkspaceAdmin } from '../middlewares/workspaceAdmin';

const router = express.Router();

router.get('/:channelId/members', authenticate, getChannelMembers);
router.patch('/:channelId/members/:userId', authenticate, isWorkspaceAdmin, updateChannelMemberRole);
router.delete('/:channelId/members/:userId', authenticate, isWorkspaceAdmin, removeChannelMember);

export default router;
