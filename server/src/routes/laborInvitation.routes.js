import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

import {
  sendLaborInvitationController,
  getWorkerInvitationsController,
  getJobInvitationsController,
  updateInvitationStatusController,
} from "../controllers/laborInvitation.controller.js";

const router = express.Router();

router.post(
  "/jobs/:jobId/invitations",
  authenticate,
  authorize("OWNER"),
  sendLaborInvitationController
);

router.get(
  "/jobs/:jobId/invitations",
  authenticate,
  authorize("OWNER"),
  getJobInvitationsController
);

router.get(
  "/invitations",
  authenticate,
  authorize("WORKER"),
  getWorkerInvitationsController
);

router.patch(
  "/invitations/:invitationId/status",
  authenticate,
  authorize("WORKER"),
  updateInvitationStatusController
);

export default router;