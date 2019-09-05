import React, { Component } from "react";
import Database from "../Database";
import { Subscription } from "rxjs";

export default class Playlist extends Component {
  sub!: Subscription;
  state = {
    songs: []
  };

  componentDidMount() {
    // const current = await Database.music.getLocal("current");
    // current.get$("song").subscribe(id => {
    //   if (!id) {
    //     return;
    //   }
    //   this.getSong(id);
    // });
    this.sub = Database.music.$.subscribe((_music: any) => {
      if (_music.isLocal) {
        return;
      }
      this.getMusic();
    });
  }

  async getMusic() {
    const songs = await Database.music.find().exec();
    this.setState({ songs });
  }

  async selectSong(song: any) {
    await Database.music.upsertLocal("current", { song: song.id });
  }

  render() {
    return (
      <div>
        <h5>Playlist</h5>
        {this.state.songs.map((song: any) => {
          return (
            <div
              style={{
                padding: 10,
                margin: 10,
                border: "1px solid blue"
              }}
              key={song.id}
              onClick={() => this.selectSong(song)}
            >
              {song.title}
            </div>
          );
        })}
      </div>
    );
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
  }
}
