import React, { Component } from "react";
import { Subscription } from "rxjs";
import SoundAudioPlayer from "soundcloud-audio";
// import * as Database from "../Database";
import { RxDatabase } from "rxdb";

interface PlayerState {
  trackTitle: string;
  current: string;
  songs: string[];
}
export default class Player extends Component {
  // db!: RxDatabase<Database.DatabaseCollections>;
  song!: Subscription;
  queue!: Subscription;
  player = new SoundAudioPlayer();
  state: PlayerState = {
    trackTitle: "",
    current: "",
    songs: []
  };

  componentDidMount() {
    this.initializePlayer();
  }

  async initializePlayer() {
    // this.db = await Database.get();
    // const current = await this.db.songs.getLocal("current");
    // const queue = await this.db.songs.getLocal("queue");
    // this.queue = queue.get$("songs").subscribe((songs) => {
    //   this.setState({ songs });
    // });
    // this.song = current.get$("song").subscribe(id => {
    //   if (!id) {
    //     this.player.stop();
    //     return;
    //   }
    //   this.getSong(id);
    // });
    // this.player.on("ended", () => {
    //   console.log("song ended");
    //   this.nextSong();
    // });
  }

  async getSong(id: string) {
    // const song = await this.db.songs.findOne({ id }).exec();
    // if (!song) {
    //   return;
    // }
    // const streamUrl = await fetch(`${process.env.REACT_APP_API}/download?filename=${song.filename}`, {
    //   method: "GET"
    // }).then((res) => {
    //   return res.text();
    // });
    // if (!streamUrl) {
    //   return;
    // }
    // this.setState({ current: id, trackTitle: song.title });
    // this.player.play({ streamUrl: `https://${streamUrl}` });
  }

  previousSong() {
    if (this.player.audio.currentTime > 5) {
      this.player.setTime(0);
      return;
    }
    const position = this.state.songs.findIndex((song) => song === this.state.current);
    if (position) {
      const song = this.state.songs[position - 1];
      this.setState({ current: song }, () => {
        // this.db.songs.upsertLocal("current", { song });
      });
      return;
    }
    this.player.setTime(0);
  }

  nextSong() {
    const position = this.state.songs.findIndex((song) => song === this.state.current);
    if (position < this.state.songs.length) {
      const song = this.state.songs[position + 1];
      this.setState({ current: song }, () => {
        // this.db.songs.upsertLocal("current", { song });
      });
    }
  }

  render() {
    return (
      <div>
       player
      </div>
    );
  }

  componentWillUnmount() {
    this.queue.unsubscribe();
    this.song.unsubscribe();
    this.player.unbindAll();
  }
}
