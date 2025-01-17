import { Request, Response } from 'express';
import { prisma } from '../prisma/prismaClient';
import { Role } from '@prisma/client';

// Get all members of a channel
export const getChannelMembers = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;

    const members = await prisma.channelUser.findMany({
      where: { channelId: parseInt(channelId) },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    res.status(200).json({ members });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching channel members', error: error.message });
  }
};

// Update a member's role in the channel
export const updateChannelMemberRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { channelId, userId } = req.params;
    const { role } = req.body;

    if (!Object.values(Role).includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    const updatedMember = await prisma.channelUser.update({
      where: {
        userId_channelId: {
          channelId: parseInt(channelId),
          userId: parseInt(userId),
        },
      },
      data: { role },
    });

    res.status(200).json({ message: 'Role updated successfully', updatedMember });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

// Remove a member from the channel
export const removeChannelMember = async (req: Request, res: Response) => {
  try {
    const { channelId, userId } = req.params;

    await prisma.channelUser.delete({
      where: {
        userId_channelId: {
          channelId: parseInt(channelId),
          userId: parseInt(userId),
        },
      },
    });

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error removing member', error: error.message });
  }
};
