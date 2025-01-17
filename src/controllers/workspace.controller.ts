import { Request, Response } from "express";
import { createWorkspaceService } from "../services/workspace.service";
import { ValidationError } from "../utils/errors";
import { prisma } from "../prisma/prismaClient";

export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name) {
      throw new ValidationError("Workspace name is required");
    }

    const workspace = await createWorkspaceService(name, description, userId);

    res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addWorkspaceMember = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params; 
    const { email, role } = req.body; 

    // Check if the workspace exists
    const workspace = await prisma.workspace.findUnique({
      where: { id: parseInt(workspaceId, 10) },
    });

    if (!workspace) {
      throw new ValidationError("Workspace not found");
    }

    // Verify that the requesting user is an admin of the workspace
    const requesterWorkspaceUser = await prisma.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: req.user.id,
          workspaceId: workspace.id,
        },
      },
    });

    if (!requesterWorkspaceUser || requesterWorkspaceUser.role !== "ADMIN") {
      res
        .status(403)
        .json({
          message:
            "You do not have permission to add members to this workspace",
        });
      return;
    }

    // Check if the user to add exists
    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      throw new ValidationError("User with the given email does not exist");
    }

    // Check if the user is already a member of the workspace
    const existingMembership = await prisma.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: userToAdd.id,
          workspaceId: workspace.id,
        },
      },
    });

    if (existingMembership) {
      res
        .status(400)
        .json({ message: "User is already a member of this workspace" });
      return;
    }

    // Add the user to the workspace
    const newMembership = await prisma.workspaceUser.create({
      data: {
        userId: userToAdd.id,
        workspaceId: workspace.id,
        role: role || "MEMBER",
      },
    });

    res.status(201).json({
      message: "User added to the workspace successfully",
      membership: newMembership,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
