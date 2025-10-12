/*import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { ApiError } from "./ApiError.js";
import refreshTokens from '../models/refreshTokenModel.js';

const { JWT_SECRET_KEY, REFRESH_TOKEN_MS } = process.env;

async function getUserIdFromRefreshToken(plain) {
  const hashed = hashRefreshToken(plain);
  const { rows } = await refreshTokens.findByHash(hashed); // uusi mallifunktio
  return rows[0]?.user_id ?? null;
}

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

export { getUserIdFromRefreshToken, signAccessToken, auth, generateRefreshToken, storeRefreshToken, verifyRefreshToken, revokeRefreshToken, rotateRefreshToken };*/

// helpers/auth.js
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import refreshTokens from '../models/refreshTokenModel.js';
import { ApiError } from './ApiError.js';

const { JWT_SECRET_KEY, REFRESH_TOKEN_MS } = process.env;

// --- ACCESS TOKEN ---
export function signAccessToken(dbUser) {
  return jwt.sign(
    { sub: dbUser.id, email: dbUser.email },
    JWT_SECRET_KEY,
    {
      algorithm: 'HS256',
      expiresIn: '15m',
      issuer: 'movieapp',
      audience: 'movieapp-clients'
    }
  );
}

// --- REFRESH TOKEN ---
export function generateRefreshToken() {
  return crypto.randomBytes(48).toString('base64url');
}

export function hashRefreshToken(token) {
  return crypto.createHash('sha256').update(token).digest('base64');
}

export async function storeRefreshToken(userID, plain) {
  const hashedToken = hashRefreshToken(plain);
  const expiration = new Date(Date.now() + Number(REFRESH_TOKEN_MS));
  await refreshTokens.add(userID, hashedToken, expiration);
}

export async function verifyRefreshToken(userID, plain) {
  const hashedToken = hashRefreshToken(plain);
  const { rows } = await refreshTokens.verify(userID, hashedToken);
  return !!rows[0];
}

// --- REVOKE TOKEN ---
export async function revokeRefreshToken(userID, plain) {
  if (plain) {
    const hashedToken = hashRefreshToken(plain);
    await refreshTokens.revoke(userID, hashedToken);
  } else {
    await refreshTokens.revokeAll(userID); // revoke all tokens for the user
  }
}

// --- ROTATE TOKEN ---
export async function rotateRefreshToken(userID, oldPlain) {
  await revokeRefreshToken(userID, oldPlain);
  const freshToken = generateRefreshToken();
  await storeRefreshToken(userID, freshToken);
  return freshToken;
}

// --- GET USER ID FROM REFRESH TOKEN ---
export async function getUserIdFromRefreshToken(plain) {
  if (!plain) return null;
  const hashed = hashRefreshToken(plain);
  const { rows } = await refreshTokens.findByHash(hashed);
  return rows[0]?.user_id ?? null;
}

// --- AUTH MIDDLEWARE ---
export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError('No token provided', 401));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY, {
      algorithms: ['HS256'],
      issuer: 'movieapp',
      audience: 'movieapp-clients'
    });

    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return next(new ApiError('Invalid or expired token', 401));
  }
};