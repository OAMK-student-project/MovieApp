/*import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import moviesRouter from "./routes/moviesRouter.js"
import userRouter from "./routes/userRouter.js"
import groupsRouter from './routes/groupsRouter.js';

const app = express();
app.use(cors());
app.use(express.json());

//Router imports here
app.use("/api/movies", moviesRouter);
app.use("/users", userRouter);
app.use('/groups', groupsRouter);


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



app.listen(port, ()=>console.log(`Server running at port ${port}`));*/


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import moviesRouter from "./routes/moviesRouter.js";
import userRouter from "./routes/userRouter.js";
import groupsRouter from "./routes/groupsRouter.js";

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // change if needed
  credentials: true
}));


app.use(cookieParser());
app.use(express.json());


app.get("/healthz", (req, res) => res.send("ok"));

app.use("/api/movies", moviesRouter);
app.use("/users", userRouter);
app.use("/groups", groupsRouter);
app.use("/api/user", userRouter);

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
