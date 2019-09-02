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
    const trackTitle = song.title;
    this.setState({ streamUrl, trackTitle }, () => {
      this.player.play();
    });
  }

  previousSong(opts: any) {
    console.log(this.player);
  }

  nextSong(opts: any) {
    console.log(opts);
  }

  render() {
    if (!this.state.streamUrl) {
      return <div />;
    }
    return (
      <div>
        <Controls
          streamUrl={this.state.streamUrl}
          previousSong={(opts: any) => this.previousSong.bind(this)(opts)}
          nextSong={(opts: any) => this.nextSong.bind(this)(opts)}
          soundCloudAudio={this.player}
        />
      </div>
    );
  }

  componentWillUnmount() {
    this.song.unsubscribe();
  }
}
