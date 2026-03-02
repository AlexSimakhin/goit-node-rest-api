import express from "express";
import { register, login, logout, getCurrent, updateSubscription, updateAvatar } from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema, subscriptionSchema } from "../schemas/authSchemas.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const tempDir = path.resolve("temp");
const upload = multer({ dest: tempDir });

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", authMiddleware, logout);
router.get("/current", authMiddleware, getCurrent);
router.patch("/subscription", authMiddleware, validateBody(subscriptionSchema), updateSubscription);
router.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

export default router;
