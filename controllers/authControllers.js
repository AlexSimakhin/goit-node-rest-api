import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";

const { JWT_SECRET = "secret" } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) throw HttpError(409, "Email in use");
    const hashPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email, { s: "250", d: "identicon" }, true);

    const user = await User.create({ email, password: hashPassword, avatarURL });
    res.status(201).json({ user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) throw HttpError(401, "Email or password is wrong");
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) throw HttpError(401, "Email or password is wrong");
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
    await user.update({ token });
    res.json({ token, user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findByPk(id);
    if (!user) throw HttpError(401, "Not authorized");
    await user.update({ token: null });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { subscription } = req.body;
    const user = await User.findByPk(id);
    if (!user) throw HttpError(401, "Not authorized");
    await user.update({ subscription });
    res.json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw HttpError(400, "File not provided");
    const { id } = req.user;
    const { path: tempPath, originalname } = req.file;
    const ext = path.extname(originalname);
    const avatarsDir = path.resolve("public", "avatars");
    await fs.mkdir(avatarsDir, { recursive: true });
    const filename = `${id}${Date.now()}${ext}`;
    const resultPath = path.join(avatarsDir, filename);

    await fs.rename(tempPath, resultPath);

    const avatarURL = `/avatars/${filename}`;
    const user = await User.findByPk(id);
    if (!user) throw HttpError(401, "Not authorized");
    await user.update({ avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
