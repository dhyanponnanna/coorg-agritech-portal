
import { Router } from "express";

import {
  subscribe,
  verifySubscription,
  unsubscribe,
} from "../controllers/emailSubscription.controller.js";

const router = Router();

router.post("/", subscribe);
router.get("/verify", verifySubscription);
router.get("/unsubscribe", unsubscribe);

export default router;
