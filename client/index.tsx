import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import { Quiz } from "./quiz";

function Application() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Quiz />} path={"/"} />
        <Route path={"/correct"} element={<h1>Correct</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<Application />, document.getElementById("app"));
