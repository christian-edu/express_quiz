import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import { CorrectAnswer, FrontPage, Quiz } from "./quiz";

function Application() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<FrontPage />} path={"/"} />
        <Route element={<Quiz />} path={"/quiz"} />
        <Route path={"/correct"} element={CorrectAnswer()} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<Application />, document.getElementById("app"));
