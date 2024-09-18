import React from "react";
import "./index.css"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
