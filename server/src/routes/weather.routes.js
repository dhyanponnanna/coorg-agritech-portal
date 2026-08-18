import { Router } from "express";
import { getCurrentWeatherController } from "../controllers/weather.controller.js";

const router = Router();

router.get("/current/:location", getCurrentWeatherController);

export default router;