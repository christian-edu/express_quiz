import express from "express";
import bodyParser from "body-parser";
import request from "supertest";
import {QuizApp} from "../quizApp";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser("topsecret"));
app.use(bodyParser.json());
app.use("/quiz", QuizApp);

describe("Tests for questions and answers", () => {
    it("Should return a random question", async () => {
        const response = await request(app).get("/quiz/random").expect(200);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            answers: expect.any(Object),
            category: expect.any(String),
        });
    });

    it("responds to correct answers", async () => {
        await request(app)
            .post("/quiz/answer")
            .send({id: 974, answer: "answer_b"})
            .expect({result: "correct"});
    });

    it("it should keep track of score", async () => {
        const agent = request.agent(app);
        await agent
            .post("/quiz/answer")
            .send({id: 974, answer: "answer_b"});
        await agent
            .post("/quiz/answer")
            .send({id: 976, answer: "answer_a"});

        await agent.get("/quiz/score")
            .expect(200)
            .expect({answers: 2, correct: 1});
    });
});
