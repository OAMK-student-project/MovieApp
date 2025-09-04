import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/healthz", (req,res)=>res.send("ok"));

app.listen(3001, ()=>console.log("Server running on 3001"));
