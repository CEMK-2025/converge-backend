import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/prismaClient';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
