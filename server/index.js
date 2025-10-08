

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import moviesRouter from "./routes/moviesRouter.js";
import userRouter from "./routes/userRouter.js";
import groupsRouter from "./routes/groupsRouter.js";
import myGroupsRoutes from "./routes/myGroupsRouter.js";
import reviewRouter from "./routes/reviewRouter.js"; //  import reviews

import movieRouter from "./routes/movieRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import favMoviesRouter from "./routes/favMoviesRouter.js";
import favListRouter from "./routes/favListRouter.js";
import favSharedRouter from "./routes/favSharedRouter.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // change if needed
  credentials: true

}));

app.use(cookieParser());
app.use(express.json());

app.get("/healthz", (req, res) => res.send("ok"));

app.use("/api/movies", moviesRouter);
app.use("/api/reviews", reviewRouter);
app.use("/favourite", favMoviesRouter);
app.use("/favourite-lists", favListRouter);
app.use("/shared", favSharedRouter);


app.use("/groups", groupsRouter);
app.use("/user", userRouter);

app.use("/user", myGroupsRoutes);
app.use((req, res, next) => {
  next({ status: 404, message: "Not found" });
});


app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: { message: err.message, status: statusCode }
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running at port ${port}`));
