import * as React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type answerType =
  | "answer_a"
  | "answer_b"
  | "answer_c"
  | "answer_d"
  | "answer_e"
  | "answer_f";
type answer_correct = `${answerType}_correct`;

interface IQuestion {
  id: number;
  question: string;
  description: string | null;
  answers: Record<answerType, string | null>;
  multiple_correct_answers: "true" | "false";
  correct_answers: Record<answer_correct, "true" | "false">;
  explanation: string | null;
  tip: string | null;
  tags: { name: string }[];
  category: string;
  difficulty: "Easy";
}

interface IScore {
  answers: number;
  correct: number;
}

function Answers({ question }: { question: IQuestion }) {
  const { answers }: { answers: Record<answerType, string | null> } = question;
  const [answer, setAnswer] = useState<answerType>();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!answer) throw Error("Nothing selected!");
    const res = fetch("/quiz/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer, id: question.id }),
    });
    res
      .then((r) => r.json())
      .then((d) => {
        if (d.result.toLowerCase() === "correct") navigate("/correct");
        else navigate("/wrong");
        console.log(d);
      })
      .catch((e) => console.error(e));
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {Object.keys(answers)
          .map((el) => el as answerType)
          .filter((v) => answers[v] !== null)
          .map((answerOption) => {
            return (
              <div key={answerOption}>
                <input
                  type={"radio"}
                  name={question.question}
                  value={answerOption}
                  onChange={(e) => setAnswer(e.target.value as answerType)}
                />{" "}
                {answers[answerOption]}
              </div>
            );
          })}
        <button>Check answer</button>
      </form>
    </>
  );
}

function Question({ question }: { question: IQuestion }) {
  return (
    <div>
      <h1>{question.question}</h1>
      <Answers question={question} />
    </div>
  );
}

export function Quiz() {
  const [question, setQuestion] = useState<IQuestion>();
  const [loading, setLoading] = useState(true);
  useEffect((): void => {
    setLoading(true);
    const randomQuestion = async (): Promise<IQuestion> => {
      const res = await fetch("/quiz/random");
      return await res.json();
    };
    randomQuestion().then((d) => {
      setQuestion(d);
      setLoading(false);
    });
  }, []);
  if (!loading && question !== undefined) {
    return (
      <div>
        <Navigation />
        <Question question={question} />
      </div>
    );
  } else return <h1>Loading..</h1>;
}

function Navigation() {
  return (
    <>
      <Link to={"/score"}>Score</Link>
      <Link to={"/quiz"}>New question</Link>
    </>
  );
}

export function FrontPage() {
  return <div>{Navigation()}</div>;
}

export function CorrectAnswer() {
  return (
    <div>
      <Navigation />
      <h1>Correct answer!</h1>
    </div>
  );
}

export function WrongAnswer() {
  return (
    <div>
      <Navigation />
      <h1>Wrong answer!</h1>
    </div>
  );
}

export function Score() {
  const [score, setScore] = useState<IScore>();
  useEffect(() => {
    const data = async () => {
      const res = await fetch("/quiz/score");
      return await res.json();
    };
    data().then((s) => setScore(s as IScore));
  }, []);
  if (score) {
    return (
      <div>
        <Navigation />
        <p>Correct Answers: {score.correct}</p>
        <p>Total Answers: {score.answers}</p>
      </div>
    );
  }
  return <div>loading..</div>;
}
