import React from "react";
import "./App.css";
import Layout from "./layout/layout";
import UrlValidator from "./components/urlValidator/urlValidator";

function App() {
  return (
    <div className="App">
      <Layout />
      <UrlValidator />
    </div>
  );
}

export default App;
