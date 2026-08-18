import { Router } from "express";
import { reverseGeocodeController, searchLocationsController } from "../controllers/geocoding.controller.js";

const router = Router();

router.get("/search", searchLocationsController);
router.get("/reverse", reverseGeocodeController);

export default router;