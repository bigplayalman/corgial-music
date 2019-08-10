import React, { Component } from "react";
import Database from "./Database";
import { FileUpload } from "./FileUpload";

export default class App extends Component {
  state = {
    dbReady: false
  };

  async componentDidMount() {
    await Database.init();
    this.setState({dbReady: true});
  }

  render() {
    if (!this.state.dbReady) {
      return <div>Loading...</div>;
    }
    return (
      <div className="App">
        <FileUpload />
      </div>
    );
  }
}
