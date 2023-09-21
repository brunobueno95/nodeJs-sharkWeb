require("dotenv").config();
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import comression from "compression";
import cors from "cors";
import mongoose, { Promise } from "mongoose";
import {
  getAllSharks,
  getShark,
  addShark,
  removeShark,
  updateShark,
} from "./controllers/sharksControllers";

import { loginUser } from "./controllers/userController";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(comression());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server runnin on port 8080");
});

const MONGO_URL = process.env.MONGO_URL;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

// Shark API routes
app.get("/sharks", getAllSharks);
app.get("/sharks/:id", getShark);
app.post("/sharks", addShark);
app.put("/sharks/:id", updateShark);
app.delete("/sharks/:id", removeShark);

// User API routes

app.post("/login", loginUser);
