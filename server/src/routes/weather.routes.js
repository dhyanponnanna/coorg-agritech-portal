import { Router } from "express";
import {
  getCurrentWeatherController,
  getWeatherForecastController,
  getHistoricalWeatherController,
  getCurrentWeatherByCoordinatesController,
  getWeatherForecastByCoordinatesController,
  getAllLocationsController,
} from "../controllers/weather.controller.js";

const router = Router();

router.get("/current", getCurrentWeatherByCoordinatesController);
router.get("/forecast", getWeatherForecastByCoordinatesController);
router.get("/current/:location", getCurrentWeatherController);
router.get("/forecast/:location", getWeatherForecastController);
router.get("/history/:location", getHistoricalWeatherController);
router.get("/locations", getAllLocationsController);


export default router;