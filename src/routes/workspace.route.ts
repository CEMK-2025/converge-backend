import { Router } from "express";
import {
  addWorkspaceMember,
  createWorkspace,
} from "../controllers/workspace.controller";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create", authenticate, createWorkspace);

router.post("/:workspaceId/members", authenticate, addWorkspaceMember);

export default router;
