import express from "express";

import { randomQuestion, isCorrectAnswer, Questions } from "./questions";

export const QuizApp = express.Router();

QuizApp.get("/random", (req, res) => {
  const question = randomQuestion();
  console.info(question);
  res.json(question);
  res.status(200);
});

QuizApp.post("/answer", (req, res) => {
  const { answer, id } = req.body;
  const question = Questions.find((v) => v.id === id);
  const score = req.signedCookies.score
    ? JSON.parse(req.signedCookies.score)
    : { answers: 0, correct: 0 };

  if (!question) {
    return res.sendStatus(404);
  }
  if (isCorrectAnswer(question, answer)) {
    score.answers++;
    score.correct++;
    res.cookie("score", JSON.stringify(score), { signed: true });
    res.json({ result: "correct" });
  } else {
    score.answers++;
    res.cookie("score", JSON.stringify(score), { signed: true });
    res.json({ result: "incorrect " });
  }
});

QuizApp.get("/score", (req, res) => {
  const score = req.signedCookies.score
    ? JSON.parse(req.signedCookies.score)
    : { answers: 0, correct: 0 };
  res.json(score);
});
