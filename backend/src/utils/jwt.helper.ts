import * as jwt from "jsonwebtoken";
import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (
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
  return jwt.verify(token, secret, {
    algorithms: ["HS256"],
  }) as JwtPayload;
};

export const JwtHelpers = {
  createToken,
  verifyToken,
  createResetToken,
};