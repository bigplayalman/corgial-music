import React, { Component } from "react";
import Database from "./Database";
import { FileUpload } from "./FileUpload";
import Playlist from "./components/Playlist";
import Player from "./components/Player";

export default class App extends Component {
  state = {
    dbReady: false,
    currentSong: null
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
        <Playlist />
        <Player />
      </div>
    );
  }
}
