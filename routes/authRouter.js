import express from "express";
import { register, login, logout, getCurrent, updateSubscription } from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema, subscriptionSchema } from "../schemas/authSchemas.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", authMiddleware, logout);
router.get("/current", authMiddleware, getCurrent);
router.patch("/subscription", authMiddleware, validateBody(subscriptionSchema), updateSubscription);

export default router;
