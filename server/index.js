import express from "express";
import cors from "cors";
import "dotenv/config";

//Router imports here

const app = express();
app.use(cors());
app.use(express.json());
//routes here, healthz is for initial testing
app.get("/healthz", (req,res)=>res.send("ok"));

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
