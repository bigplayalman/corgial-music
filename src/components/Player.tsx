import React, { Component } from "react";
import { Subscription } from "rxjs";
import SoundAudioPlayer from "soundcloud-audio";
import { Controls } from "./Controls";
import Database from "../Database";

interface PlayerState {
  trackTitle: string;
  current: string;
  songs: string[];
}
export default class Player extends Component {
  song!: Subscription;
  queue!: Subscription;
  player = new SoundAudioPlayer();
  state: PlayerState = {
    trackTitle: "",
    current: "",
    songs: []
  };

  async componentDidMount() {
    const current = await Database.music.getLocal("current");
    const queue = await Database.music.getLocal("queue");
    this.queue = queue.get$("songs").subscribe((songs) => {
      this.setState({ songs });
    });
    this.song = current.get$("song").subscribe(id => {
      if (!id) {
        this.player.stop();
        return;
      }
      this.getSong(id);
    });
  }

  async getSong(id: string) {
    const song = await Database.music.findOne().where("id").eq(id).exec();
    if (!song) {
      return;
    }
    const attachment = song.getAttachment(id + "song");
    if (!attachment) {
      return;
    }
    const buffer = await attachment.getData();
    const streamUrl = URL.createObjectURL(buffer);
    this.setState({ current: id, trackTitle: song.title });
    this.player.play({ streamUrl });
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
        this.getSong(song);
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
        this.getSong(song);
      });
    }
  }

  render() {
    return (
      <div>
        <h4>{this.state.trackTitle}</h4>
        <Controls
          previousSong={() => this.previousSong()}
          nextSong={() => this.nextSong()}
          soundCloudAudio={this.player}
        />
      </div>
    );
  }

  componentWillUnmount() {
    this.queue.unsubscribe();
    this.song.unsubscribe();
  }
}
