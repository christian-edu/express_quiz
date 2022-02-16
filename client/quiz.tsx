import * as React from "react";
import { MouseEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type answer =
  | "answer_a"
  | "answer_b"
  | "answer_c"
  | "answer_d"
  | "answer_e"
  | "answer_f";
type answer_correct = `${answer}_correct`;

interface Question {
  id: number;
  question: string;
  description: string | null;
  answers: Record<answer, string | null>;
  multiple_correct_answers: "true" | "false";
  correct_answers: Record<answer_correct, "true" | "false">;
  explanation: string | null;
  tip: string | null;
  tags: { name: string }[];
  category: string;
  difficulty: "Easy";
}

function Answers(props: { question: Question }) {
  const { answers } = props.question;
  const [answer, setAnswer] = useState<string>();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!answer) throw Error("Nothing selected!");
    console.log(answer);
    const res = fetch("/quiz/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer, id: props.question.id }),
    });
    res
      .then((r) => r.json())
      .then((d) => console.log(d))
      .catch((e) => console.error(e));
    navigate("/correct");
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {Object.keys(answers)
          .map((el) => el as answer)
          .filter((v) => answers[v] !== null)
          .map((answerOption) => {
            return (
              <div key={answerOption}>
                <input
                  type={"radio"}
                  name={props.question.question}
                  value={answerOption}
                  onChange={(e) => setAnswer(e.target.value)}
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

function Question(props: { question: Question }) {
  const { question } = props;
  return (
    <div>
      <h1>{question.question}</h1>
      <Answers question={question} />
    </div>
  );
}

export function Quiz() {
  const [question, setQuestion] = useState<Question>();
  const [loading, setLoading] = useState(true);
  useEffect((): void => {
    setLoading(true);
    const randomQuestion = async (): Promise<Question> => {
      const res = await fetch("/quiz/random");
      return await res.json();
    };
    randomQuestion().then((d) => {
      setQuestion(d);
      setLoading(false);
    });
  }, []);
  if (!loading && question !== undefined) {
    return <Question question={question} />;
  } else return <h1>Loading..</h1>;
}
