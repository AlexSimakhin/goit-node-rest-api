import { login } from "../controllers/authControllers.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

jest.mock("../models/user.js", () => ({
  findOne: jest.fn(),
  update: jest.fn(),
}));
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

const mockReq = (body = {}) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("login controller", () => {
  let next;

  beforeEach(() => {
    jest.clearAllMocks();
    next = jest.fn();
  });

  it("should return 200 and token on successful login", async () => {
    const userData = {
      id: 1,
      email: "testuser@example.com",
      password: "hashed_password",
      subscription: "starter",
      update: jest.fn().mockResolvedValue(true)
    };

    User.findOne.mockResolvedValue(userData);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("testtoken");

    const req = mockReq({ email: "testuser@example.com", password: "Test12345" });
    const res = mockRes();

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: "testtoken",
      user: expect.objectContaining({
        email: "testuser@example.com",
        subscription: "starter",
      }),
    }));
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with Error if user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const req = mockReq({ email: "notfound@example.com", password: "Test12345" });
    const res = mockRes();

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should call next with Error if password is incorrect", async () => {
    User.findOne.mockResolvedValue({ 
      email: "test@test.com", 
      password: "hash",
      update: jest.fn() 
    });
    bcrypt.compare.mockResolvedValue(false);

    const req = mockReq({ email: "test@test.com", password: "WrongPassword" });
    const res = mockRes();

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should call next if email or password is missing", async () => {
    const res = mockRes();
    
    await login(mockReq({ email: "test@test.com" }), res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    
    await login(mockReq({ password: "password" }), res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should call next with Error if unexpected error occurs", async () => {
    User.findOne.mockRejectedValue(new Error("DB error"));

    const req = mockReq({ email: "test@test.com", password: "password" });
    const res = mockRes();

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});