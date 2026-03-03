import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import path from 'path';
import fs from 'fs/promises';
import HttpError from '../helpers/HttpError.js';

const { JWT_SECRET = 'secret' } = process.env;

export async function registerUser({ email, password }) {
  const userExists = await User.findOne({ where: { email } });
  if (userExists) throw HttpError(409, 'Email in use');
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: '250', d: 'identicon' }, true);
  const user = await User.create({ email, password: hashPassword, avatarURL });
  return { email: user.email, subscription: user.subscription };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw HttpError(401, 'Email or password is wrong');
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
