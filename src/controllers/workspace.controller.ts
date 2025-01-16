import { Request, Response } from 'express';
import { createWorkspaceService } from '../services/workspace.service';
import { ValidationError } from '../utils/errors';

export const createWorkspace = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      throw new ValidationError('Workspace name is required');
    }

    const workspace = await createWorkspaceService(name, description, userId);

    res.status(201).json({
      message: 'Workspace created successfully',
      workspace,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
