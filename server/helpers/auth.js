import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { ApiError } from "./ApiError.js";
import refreshTokens from '../models/refreshTokenModel.js';

const { JWT_SECRET_KEY, REFRESH_TOKEN_MS } = process.env;

function signAccessToken(dbUser) {
  return jwt.sign(
    { sub: dbUser.id, email: dbUser.email },
    JWT_SECRET_KEY,
    {
      algorithm: "HS256",
      expiresIn: "15m",
      issuer: "movieapp",
      audience: "movieapp-clients"
    }
  );
}

//Tämä token annetaan asiakkaalle
function generateRefreshToken() {
    return crypto.randomBytes(48).toString("base64url");
}

//tämä tallennetaan kantaan
function hashRefreshToken(token) {
    return crypto.createHash("sha256").update(token).digest("base64");
}

async function storeRefreshToken(userID, plain) {
    const hashedToken = hashRefreshToken(plain);
    const expiration = new Date(Date.now() + Number(REFRESH_TOKEN_MS));
    await refreshTokens.add(userID, hashedToken, expiration);
}

async function verifyRefreshToken(userID, plain) {
    const hashedToken = hashRefreshToken(plain);
    const { rows } = await refreshTokens.verify(userID, hashedToken);
    return !!rows[0];
}

async function revokeRefreshToken(userID, plain) {
    const hashedToken = hashRefreshToken(plain);
    await refreshTokens.revoke(userID, hashedToken);
}

async function rotateRefreshToken(userID, oldPlain) {
    await revokeRefreshToken(userID, oldPlain);
    const freshToken = generateRefreshToken();
    await storeRefreshToken(userID, freshToken);
    return freshToken;
}

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError("No token provided", 401));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY, {
        algorithms: ["HS256"],
        issuer: "movieapp",
        audience: "movieapp-clients"
    });

    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return next(new ApiError("Invalid or expired token", 401));
  }
};

export { signAccessToken, auth, generateRefreshToken, storeRefreshToken, verifyRefreshToken, revokeRefreshToken, rotateRefreshToken };