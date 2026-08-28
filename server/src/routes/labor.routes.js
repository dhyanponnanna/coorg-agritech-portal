import express from "express";
import {
  createLaborJobController,
  getOpenLaborJobsController,
  getLaborJobByIdController,
  getLaborJobsByOwnerController,
  createWorkerProfileController,
  getWorkerProfileController,
  applyForLaborJobController,
  getJobApplicationsController,
  getWorkerApplicationsController,
  updateApplicationStatusController,
  matchWorkersToJobController,
} from "../controllers/labor.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/jobs", getOpenLaborJobsController);
router.get("/jobs/:id", getLaborJobByIdController);

router.post(
  "/jobs",
  authenticate,
  authorize("OWNER"),
  createLaborJobController
);

router.get(
  "/owner/jobs",
  authenticate,
  authorize("OWNER"),
  getLaborJobsByOwnerController
);

router.post(
  "/worker/profile",
  authenticate,
  authorize("WORKER"),
  createWorkerProfileController
);

router.get(
  "/worker/profile",
  authenticate,
  authorize("WORKER"),
  getWorkerProfileController
);

router.post(
  "/jobs/:jobId/apply",
  authenticate,
  authorize("WORKER"),
  applyForLaborJobController
);

router.get(
  "/jobs/:jobId/applications",
  authenticate,
  authorize("OWNER"),
  getJobApplicationsController
);

router.get(
  "/jobs/:jobId/matches",
  authenticate,
  authorize("OWNER"),
  matchWorkersToJobController
);

router.get(
  "/worker/applications",
  authenticate,
  authorize("WORKER"),
  getWorkerApplicationsController
);

router.patch(
  "/applications/:applicationId/status",
  authenticate,
  authorize("OWNER"),
  updateApplicationStatusController
);

export default router;