import {AddressInfo} from "net";
import {QuizApp} from "./quizApp";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();


app.use(cookieParser("topsecret"));
app.use(bodyParser.json());
app.use("/quiz", QuizApp);


const server = app.listen(5000, () => {
    console.info(
        `Server running at http://localhost:${
            (server.address() as AddressInfo).port
        }`
    );
});