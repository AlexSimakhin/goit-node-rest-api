import jwt from "jsonwebtoken";
import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET = "secret" } = process.env;

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) throw HttpError(401, "Not authorized");
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      throw HttpError(401, "Not authorized");
    }
    const user = await User.findByPk(payload.id);
    if (!user || user.token !== token) throw HttpError(401, "Not authorized");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
