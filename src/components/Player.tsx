import React, { Component } from "react";
import { Subscription } from "rxjs";
import SoundAudioPlayer from "soundcloud-audio";
import { Controls } from "./Controls";
import Database from "../Database";

export default class Player extends Component {
  song!: Subscription;
  player = new SoundAudioPlayer();
  state = {
    streamUrl: "",
    trackTitle: ""
  };

  async componentDidMount() {
    const current = await Database.music.getLocal("current");
    current.get$("song").subscribe(id => {
      if (!id) {
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
    this.player.play({streamUrl});
  }

  previousSong() {
    if (this.player.audio.currentTime > 5) {
      this.player.setTime(0);
    }
  }

  nextSong() {

  }

  render() {
    return (
      <div>
        <Controls
          previousSong={() => this.previousSong()}
          nextSong={() => this.nextSong()}
          soundCloudAudio={this.player}
        />
      </div>
    );
  }

  componentWillUnmount() {
    this.song.unsubscribe();
  }
}
