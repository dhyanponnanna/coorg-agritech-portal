import express from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import {
  generateWeatherAlertsController,
  getLocationWeatherAlertsController,
  getRecentWeatherAlertsController,
  getWeatherAlertByIdController,
  deleteWeatherAlertController,
} from "../controllers/weatherAlert.controller.js";

const router = express.Router();

router.post(
  "/generate/:locationId",
  authenticate,
  generateWeatherAlertsController
);

router.get(
  "/location/:locationId",
  authenticate,
  getLocationWeatherAlertsController
);

router.get(
  "/recent",
  authenticate,
  getRecentWeatherAlertsController
);

router.get(
  "/:id",
  authenticate,
  getWeatherAlertByIdController
);

router.delete(
  "/:id",
  authenticate,
  deleteWeatherAlertController
);

export default router;