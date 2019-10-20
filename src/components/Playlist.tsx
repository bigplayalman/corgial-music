import React, { Component } from "react";
import * as Database from "../Database";
import { Subscription } from "rxjs";
import { PlaylistProps } from "../rxdb/schemas/playlist.schema";
import { RxDocument, RxDatabase } from "rxdb";
import { SongProps } from "../rxdb/schemas/song.schema";
import { DatabaseCollections } from "../Database";

interface PlaylistState {
  songs: RxDocument<SongProps>[];
  ids: string[];
}
export default class Playlist extends Component {
  db!: RxDatabase<DatabaseCollections>;
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
    this.db = await Database.get();
    const current = await this.db.playlists.getLocal("current");
    this.current = current.get$("playlist").subscribe((id) => {
      if (!id) {
        return;
      }
      this.getPlaylist(id);
    });
  }

  async getPlaylist(id: string) {
    const playlist = await this.db.playlists.findOne({ id }).exec();
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
    await this.db.songs.upsertLocal("queue", { songs: this.state.ids });
    await this.db.songs.upsertLocal("current", { song });
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
