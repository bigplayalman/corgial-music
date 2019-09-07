import React, { Component } from "react";
import Database from "../Database";
import { Subscription } from "rxjs";
import { PlaylistProps } from "../rxdb/schemas/playlist.schema";
import { RxDocument } from "rxdb";
import { SongProps } from "../rxdb/schemas/song.schema";

interface PlaylistState {
  songs: RxDocument<SongProps>[];
  ids: string[];
}
export default class Playlist extends Component {
  current!: Subscription;
  sub!: Subscription;
  state: PlaylistState = {
    songs: [],
    ids: []
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
      this.sub = playlist.$.subscribe((_change) => {
        if (playlist.songs && playlist.songs.length) {
          this.setState({ids: playlist.songs}, () => {
            this.fetchSongs(playlist);
          });
        }
      });
    }
  }

  async fetchSongs(playlist: RxDocument<PlaylistProps>) {
    const songs: SongProps[] = await playlist.populate("songs");
    this.setState({ songs });
  }

  async selectSong(song: string) {
    await Database.music.upsertLocal("queue", { songs: this.state.ids });
    await Database.music.upsertLocal("current", { song });
  }

  render() {
    return (
      <div>
        <h5>Playlist</h5>
        {this.state.songs.map((song) => {
          return (
            <div
              style={{
                padding: 10,
                margin: 10,
                border: "1px solid blue"
              }}
              key={song.id}
              onClick={() => this.selectSong(song.id)}>
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
