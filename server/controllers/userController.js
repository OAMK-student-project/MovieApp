import { hash, compare } from "bcrypt";
import users from "../models/usersModel.js";
import { generateRefreshToken, revokeRefreshToken, signAccessToken, storeRefreshToken, verifyRefreshToken, rotateRefreshToken, getUserIdFromRefreshToken } from "../helpers/auth.js";

const isProduction= process.env.NODE_ENV === "production";

const signUp = async (req, res, next) => {
  try {
    const newUser = req.body;
    if (!newUser) return res.status(400).json({ error: "User info is missing" });
    newUser.email = newUser.email?.trim().toLowerCase();
    const required = ["firstname", "lastname", "email", "password"];
    for (const field of required) {
      if (!newUser[field]) return res.status(400).json({ error: `${field} is missing` });
    }
    newUser.password_hash = await hash(newUser.password, 10);
    delete newUser.password;

    const result = await users.add(newUser);
    const safe = {
      id: result.id ?? result.rows?.[0]?.id,
      firstname: result.firstname ?? result.rows?.[0]?.firstname,
      lastname: result.lastname ?? result.rows?.[0]?.lastname,
      email: result.email ?? result.rows?.[0]?.email
    };
    return res.status(201).json(safe);
  } catch (error) {
    next(error);
  }
};

const signIn = async(req, res, next) => {
    try {
        let {email, password, remember} = req.body;
        if(!email || !password) return res.status(400).json({error: "email or password info is missing"});
        email = email.trim().toLowerCase();
        const result = await users.getByEmail(email);
        const dbUser = result.rows[0];
        const hashToCompare = dbUser?.password_hash ?? process.env.DUMMY_HASH;
        const ok = await compare(password, hashToCompare);
        if (!ok) return res.status(401).json({ error: "Sign in failed" });
        
        const token = signAccessToken(dbUser);
        const refreshTokenPlain = generateRefreshToken();
        await storeRefreshToken(dbUser.id, refreshTokenPlain);

        //Here I add reffresh token to httpOnly cookie
        const cookieOpts = {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          path: "/",
        };
        if (remember) {
          const max = Number(process.env.REFRESH_TOKEN_MS);
          if (Number.isFinite(max)) cookieOpts.maxAge = max;
        }

        res.cookie("rt", refreshTokenPlain, cookieOpts);
        res.status(200).json({ userID: dbUser.id, email: dbUser.email, accessToken: token});
    } catch (error) {
        next(error);
    } 
}

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.rt;
    if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

    const userID = await getUserIdFromRefreshToken(refreshToken);
    if (!userID) return res.status(401).json({ error: "Invalid refresh token" });

    const result = await users.getById(userID);
    const dbUser = result.rows[0];
    if (!dbUser) return res.status(401).json({ error: "Invalid user" });

    const newAccessToken = signAccessToken(dbUser);
    const newRefreshToken = await rotateRefreshToken(userID, refreshToken);

    const cookieOpts = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    };

    const remember = Boolean(req.body?.remember);
    if (remember) {
      const max = Number(process.env.REFRESH_TOKEN_MS);
      if (Number.isFinite(max)) cookieOpts.maxAge = max;
    }

    res.cookie("rt", newRefreshToken, cookieOpts);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};


const signout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.rt;

    if (refreshToken) {
      const userID = await getUserIdFromRefreshToken(refreshToken);
      if (userID) {
        await revokeRefreshToken(userID, refreshToken);
      }
    }

    res.clearCookie("rt", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
    });

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};



export {signUp, signIn, signout, refresh};