import { Router } from "express";
import {
  getCurrentWeatherController,
  getWeatherForecastController,
} from "../controllers/weather.controller.js";

const router = Router();

router.get("/current/:location", getCurrentWeatherController);
router.get("/forecast/:location", getWeatherForecastController);

export default router;