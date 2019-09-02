import React, { Component } from "react";
import Database from "../Database";
import { Subscription } from "rxjs";
import { RxDocument } from "rxdb";

export default class Player extends Component {
  song!: Subscription;
  state = {
    src: null
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
    const song: RxDocument<any> = await Database.music.findOne().where("id").eq(id).exec();
    const attachment = song.getAttachment(id + "song");
    const buffer = await attachment.getData();
    const src = URL.createObjectURL(buffer);
    this.setState({src});
  }

  render() {
    return (
      <div>
        <audio src={this.state.src || undefined} controls autoPlay />
      </div>
    );
  }

  componentWillUnmount() {
    this.song.unsubscribe();
  }
}
