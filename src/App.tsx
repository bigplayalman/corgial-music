import React, { Component } from "react";
import Database from "./Database";
import { FileUpload } from "./FileUpload";
import Playlist from "./components/Playlist";
import Player from "./components/Player";
import Playlists from "./components/Playlists";
import Delete from "./components/Delete";

export default class App extends Component {
  state = {
    dbReady: false,
    currentSong: null
  };

  componentDidMount() {
    this.setupDB();
  }

  async setupDB() {
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
        <Playlists />
        <Playlist />
        <Player />
        <Delete />
      </div>
    );
  }
}
