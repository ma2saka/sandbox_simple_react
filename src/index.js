import React from "react";
import { render } from "react-dom";
import "./index.css";

class App extends React.Component {
  render() {
    return (
      <div>
        <h1> Hello React!</h1>
        <p> this is a component.</p>
      </div>
    );
  }
}

render(<App />, document.getElementById("content"));

