import { hash, compare } from "bcrypt";
import users from "../models/usersModel.js";
import { generateRefreshToken, revokeRefreshToken, signAccessToken, storeRefreshToken, verifyRefreshToken, rotateRefreshToken } from "../helpers/auth.js";

const isProduction= process.env.NODE_ENV === "production";

const test = async (req, res, next) => {
  try {
    const result = await users.getAll();
    res.status(200).json(result.rows); 
  } catch (err) {
    next(err);
  }
};

const signUp = async(req, res, next) => {
    try {
        const newUser = req.body;
        if(!newUser) return next({error: "new user info needed"});
        newUser.password_hash = await hash(newUser.password, 10);
        delete newUser.password;
        const result = await users.add(newUser);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}


const signIn = async(req, res, next) => {
    try {
        const {email, password, remember} = req.body;
        const result = await users.getByEmail(email);
        const dbUser = result.rows[0];
        if(!dbUser) return next({error: "Kirjautuminen epäonnistui"});
        //const hashToCompare = dbUser?.password_hash ?? process.env.DUMMY_HASH;
        const isPasswordCorrect = await compare(password, dbUser.password_hash);
        if(!isPasswordCorrect) return next({error: "Kirjautuminen epäonnistui"});
        
        const token = signAccessToken(dbUser);
        const refreshTokenPlain = generateRefreshToken();
        await storeRefreshToken(dbUser.id, refreshTokenPlain);

        //Here I add reffresh token to httpOnly cookie
        const cookieOpts = {
          httpOnly: true,
          secure: isProduction,
          sameSite: "lax",
          path: "/user",
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
    const userID = req.body?.userID;
    const refreshToken = req.cookies?.rt;
    const remember = Boolean(req.body?.remember);
    if (!userID || !refreshToken) {
      return next({ status: 400, message: "Missing fields" });
    }

    const checkToken = await verifyRefreshToken(userID, refreshToken);
    if (!checkToken) return next({ status: 401, message: "Invalid refresh token" });

    const result = await users.getById(userID);
    const dbUser = result.rows[0];
    if (!dbUser) return next({ status: 401, message: "Invalid user" });

    const newAccessToken = signAccessToken(dbUser);
    const newRefreshToken = await rotateRefreshToken(userID, refreshToken);

    const cookieOpts = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/user",
    };
    if (remember) {
      const max = Number(process.env.REFRESH_TOKEN_MS);
      if (Number.isFinite(max)) cookieOpts.maxAge = max; 
    }

    res.cookie("rt", newRefreshToken, cookieOpts);

    res.status(200).json({ accessToken: newAccessToken});
  } catch (error) {
    next(error);
  }
};


const signout = async (req, res, next) => {
  try {
    const userID = req.body?.userID;
    const refreshToken = req.cookies?.rt;
    if (userID && refreshToken) {
      await revokeRefreshToken(userID, refreshToken);
    }
    res.clearCookie("rt", {
      path: "/user",
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};


export {signUp, signIn, signout, refresh, test};