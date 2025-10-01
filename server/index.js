import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRouter from "./routes/userRouter.js";
import moviesRouter from "./routes/moviesRouter.js";
import movieRouter from "./routes/movieRouter.js";
import reviewRouter from "./routes/reviewRouter.js";

//Router imports here
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

//routes here, healthz is for initial testing
app.get("/healthz", (req,res)=>res.send("ok"));
app.use("/user", userRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/movie", movieRouter);
app.use("/api/reviews", reviewRouter);

app.use((req, res, next) => {
    next({
        status: 404, 
        message: "Not found"
    });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: { message: err.message, status: statusCode }
  });
});



app.listen(port, ()=>console.log(`Server running at port ${port}`));
