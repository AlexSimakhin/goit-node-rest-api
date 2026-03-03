import * as authService from '../services/authServices.js';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.registerUser({ email, password });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const user = await authService.updateUserSubscription(
      req.user.id,
      req.body.subscription
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const result = await authService.updateUserAvatar({
      userId: req.user.id,
      file: req.file,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};
