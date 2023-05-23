import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./homepage";
import ReactDOM from "react-dom/client";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="center">
        <HomePage />
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
const root = ReactDOM.createRoot(appDiv);
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

//render(<App/>, appDiv)
