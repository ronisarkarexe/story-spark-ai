import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: object,
  secret: Secret,
  expireTime: string
): string => {
  const options = { expiresIn: expireTime } as SignOptions;
  return jwt.sign(payload, secret, options);
};

const createResetToken = (
  payload: object,
  secret: Secret,
  expireTime: string
): string => {
  const options = {
    algorithm: "HS256",
    expiresIn: expireTime,
  } as SignOptions;
  return jwt.sign(payload, secret, options);
};

const verifyToken = (
  token: string,
  secret: Secret
): JwtPayload => {
  if (!token) {
    throw new Error("Token missing");
  }

  const extractedToken = token.startsWith("Bearer ")
    ? token.split(" ")[1]
    : token;

  if (!extractedToken) {
    throw new Error("Invalid token format");
  }

  return jwt.verify(
    extractedToken,
    secret
  ) as JwtPayload;
};

export const JwtHalers = {
  createToken,
  verifyToken,
  createResetToken,
};