import jwt, { JwtPayload } from "jsonwebtoken";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return secret;
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: "7d" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};
