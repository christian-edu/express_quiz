import { AddressInfo } from "net";
import { QuizApp } from "./quizApp";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import * as path from "path";

const app = express();

app.use(cookieParser("topsecret"));
app.use(bodyParser.json());
app.use("/quiz", QuizApp);

app.use(express.static(path.resolve("~/client/dist")));
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/quiz")) {
    return res.sendFile(path.resolve("~/client/dist/index.html"));
  } else {
    next();
  }
});
const server = app.listen(process.env.PORT || 3000, () => {
  console.info(
    `Server running at http://localhost:${
      (server.address() as AddressInfo).port
    }`
  );
});
