import React, { Component } from "react";
import Database from "../Database";
import { Subscription } from "rxjs";
import { PlaylistProps } from "../rxdb/schemas/playlist.schema";
import { RxDocument } from "rxdb";

export default class Playlist extends Component {
  current!: Subscription;
  sub!: Subscription;
  state = {
    songs: []
  };

  componentDidMount() {
    this.initialize();
  }

  async initialize() {
    const current = await Database.playlists.getLocal("current");
    this.current = current.get$("playlist").subscribe((id) => {
      if (!id) {
        return;
      }

      this.getPlaylist(id);
    });
  }

  async getPlaylist(id: string) {
    const playlist = await Database.playlists.findOne({ id }).exec();
    if (playlist) {
      this.sub = playlist.$.subscribe((change) => {
        if (playlist.songs && playlist.songs.length) {
          this.fetchSongs(playlist);
        }
      });
    }
  }

  async fetchSongs(playlist: RxDocument<PlaylistProps>) {
    const songs = await playlist.populate("songs");
    this.setState({songs});
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
              onClick={() => this.selectSong(song)}>
              {song.title}
            </div>
          );
        })}
      </div>
    );
  }

  componentWillUnmount() {
    this.sub.unsubscribe();
    this.current.unsubscribe();
  }
}
