import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prismaClient";

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cookies = req.headers.cookie;
    console.log("Cookies:", cookies);

    if (!cookies) {
      console.warn("No cookies found in request");
      res.status(401).json({ message: "Unauthorized: Token missing" });
      return;
    }

    // Parse the cookies string to get the authToken
    const authToken = cookies.split(';')
      .map(cookie => cookie.trim())
      .find(cookie => cookie.startsWith('authToken='))
      ?.split('=')[1];

    if (!authToken) {
      console.warn("Auth token not found in cookies");
      res.status(401).json({ message: "Unauthorized: Token missing" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables.");
      res.status(500).json({ message: "Server configuration error: Missing JWT_SECRET" });
      return;
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET) as { id: number };
    console.log("Decoded Token:", decoded);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      console.warn("User not found for decoded token ID:", decoded.id);
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    req.user = user; // Attach the user to the request object
    console.log("Authenticated User:", user);

    next(); // Proceed to the next middleware or route handler
  } catch (error: any) {
    console.error("Error during authentication:", error.message);
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Unauthorized: Token expired" });
    } else {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  }
};