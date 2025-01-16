import { prisma } from '../prisma/prismaClient';

export const createWorkspaceService = async (
  name: string,
  description: string | null,
  userId: number
) => {
  return prisma.workspace.create({
    data: {
      name,
      description,
      workspaceUsers: {
        create: {
          userId,
          role: 'ADMIN',
        },
      },
    },
  });
};
