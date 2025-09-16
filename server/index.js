import express from "express";
import cors from "cors";
import "dotenv/config";
import finnkinoRouter from "./routes/finnkinoRouter.js"
import moviesRouter from "./routes/moviesRouter.js"


const app = express();
app.use(cors());
app.use(express.json());

app.use("/theater", finnkinoRouter);
app.use("/api/movies", moviesRouter);

//routes here, healthz is for initial testing
app.get("/healthz", (req,res)=>res.send("ok"));


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


const port = process.env.PORT || 3001;
app.listen(port, () =>
  console.log(` Backend running at http://localhost:${port}`)
);



/*
import express from "express";
import cors from "cors";
import "dotenv/config";

//Router imports here
import finnkinoRouter from "./routes/finnkinoRouter.js"

const app = express();
app.use(cors());
app.use(express.json());
//routes here, healthz is for initial testing
app.get("/healthz", (req,res)=>res.send("ok"));

app.use("/theater", finnkinoRouter);

const port = process.env.PORT || 3001;

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

*/
