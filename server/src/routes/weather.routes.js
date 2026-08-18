import { Router } from "express";
import {
  getCurrentWeatherController,
  getWeatherForecastController,
  getHistoricalWeatherController,
  getCurrentWeatherByCoordinatesController,
} from "../controllers/weather.controller.js";

const router = Router();

router.get("/current", getCurrentWeatherByCoordinatesController);
router.get("/current/:location", getCurrentWeatherController);
router.get("/forecast/:location", getWeatherForecastController);
router.get("/history/:location", getHistoricalWeatherController);


export default router;