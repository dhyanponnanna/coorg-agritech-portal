import { Router } from "express";
import { reverseGeocodeController } from "../controllers/geocoding.controller.js";

const router = Router();

router.get("/reverse", reverseGeocodeController);

export default router;