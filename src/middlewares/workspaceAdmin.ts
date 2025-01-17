import { Request, Response, NextFunction } from 'express';
import { WorkspaceRole } from '@prisma/client';
import { prisma } from '../prisma/prismaClient';

export const isWorkspaceAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const channelId = parseInt(req.params.channelId);

    // Get the workspace through the channel
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { workspaceId: true }
    });

    if (!channel) {
      res.status(404).json({ error: 'Channel not found' });
      return;
    }

    // Check if user is workspace admin
    const workspaceMember = await prisma.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId: channel.workspaceId
        }
      }
    });

    if (!workspaceMember || workspaceMember.role !== WorkspaceRole.ADMIN) {
      res.status(403).json({ error: 'Only workspace admins can perform this action' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};