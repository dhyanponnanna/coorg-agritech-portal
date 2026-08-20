import { Router } from "express";
import {
  getCurrentWeatherController,
  getWeatherForecastController,
  getHistoricalWeatherController,
  getCurrentWeatherByCoordinatesController,
  getWeatherForecastByCoordinatesController,
} from "../controllers/weather.controller.js";

const router = Router();

router.get("/current", getCurrentWeatherByCoordinatesController);
router.get("/forecast", getWeatherForecastByCoordinatesController);
router.get("/current/:location", getCurrentWeatherController);
router.get("/forecast/:location", getWeatherForecastController);
router.get("/history/:location", getHistoricalWeatherController);


export default router;