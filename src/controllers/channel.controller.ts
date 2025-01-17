import { Request, Response } from 'express';
import { prisma } from '../prisma/prismaClient';

// Create Channel Controller
export const createChannel = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const { name, type } = req.body;
    const userId = req.user.id;

    // Validate workspace existence
    const workspace = await prisma.workspace.findUnique({
      where: { id: parseInt(workspaceId) },
    });

    if (!workspace) {
      res.status(404).json({ message: 'Workspace not found' });
      return;
    }

    // Check if the user is a member of the workspace
    const workspaceUser = await prisma.workspaceUser.findFirst({
      where: {
        workspaceId: parseInt(workspaceId),
        userId,
      },
    });

    if (!workspaceUser) {
      res.status(403).json({ message: 'You are not a member of this workspace' });
      return;
    }

    // Restrict channel creation to ADMIN or MEMBER roles
    if (workspaceUser.role === 'GUEST') {
      res.status(403).json({ message: 'Guests cannot create channels' });
      return;
    }

    // Create the channel
    const channel = await prisma.channel.create({
      data: {
        name,
        type: type || 'public',
        workspaceId: parseInt(workspaceId),
      },
    });

    res.status(201).json({ message: 'Channel created successfully', channel });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
