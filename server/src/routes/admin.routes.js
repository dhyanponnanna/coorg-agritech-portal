import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { ROLES } from "../constants/roles.js";

const router = Router();

router.get(
  "/test",
  authenticate,
  authorize(ROLES.ADMIN),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "You have administrator access",
      user: req.user,
    });
  }
);

export default router;