import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import path from 'path';
import fs from 'fs/promises';
import HttpError from '../helpers/HttpError.js';
import { nanoid } from 'nanoid';
import { sendVerificationEmail } from './mailer.js';

const { JWT_SECRET = 'secret' } = process.env;

export async function registerUser({ email, password }) {
  const userExists = await User.findOne({ where: { email } });
  if (userExists) throw HttpError(409, 'Email in use');
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: '250', d: 'identicon' }, true);
  const verificationToken = nanoid();
  const user = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
    verify: false,
  });
  await sendVerificationEmail({ to: email, token: verificationToken });
  return { email: user.email, subscription: user.subscription };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw HttpError(401, 'Email or password is wrong');
  if (!user.verify) throw HttpError(401, 'Email not verified');
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, 'Email or password is wrong');
  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  await user.update({ token });
  return {
    token,
    user: { email: user.email, subscription: user.subscription },
  };
}

export async function logoutUser(id) {
  const user = await User.findByPk(id);
  if (!user) throw HttpError(401, 'Not authorized');
  await user.update({ token: null });
}

export async function getCurrentUser(user) {
  if (!user) throw HttpError(401, 'Not authorized');
  return { email: user.email, subscription: user.subscription };
}

export async function updateUserSubscription(id, subscription) {
  const user = await User.findByPk(id);
  if (!user) throw HttpError(401, 'Not authorized');
  await user.update({ subscription });
  return { email: user.email, subscription: user.subscription };
}

export async function updateUserAvatar({ userId, file }) {
  if (!file) throw HttpError(400, 'File not provided');
  const { path: tempPath, originalname } = file;
  const ext = path.extname(originalname);
  const avatarsDir = path.resolve('public', 'avatars');
  await fs.mkdir(avatarsDir, { recursive: true });
  const filename = `${userId}${Date.now()}${ext}`;
  const resultPath = path.join(avatarsDir, filename);
  await fs.rename(tempPath, resultPath);
  const avatarURL = `/avatars/${filename}`;
  const user = await User.findByPk(userId);
  if (!user) throw HttpError(401, 'Not authorized');
  await user.update({ avatarURL });
  return { avatarURL };
}

export async function verifyUserEmail(verificationToken) {
  const user = await User.findOne({ where: { verificationToken } });
  if (!user) throw HttpError(404, 'User not found');
  user.verify = true;
  user.verificationToken = null;
  await user.save();
  return true;
}

export async function resendVerificationEmail(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw HttpError(400, 'User not found');
  if (user.verify) throw HttpError(400, 'Verification has already been passed');
  if (!user.verificationToken) {
    user.verificationToken = nanoid();
    await user.save();
  }
  await sendVerificationEmail({ to: email, token: user.verificationToken });
  return true;
}
