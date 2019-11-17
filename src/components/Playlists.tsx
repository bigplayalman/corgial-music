import React, { Component } from "react";
import * as Database from "../Database";
import { PlaylistProps } from "../rxdb/schemas/playlist.schema";
import { Subscription } from "rxjs";
import { RxDatabase } from "rxdb";

interface IState {
  playlists: PlaylistProps[];
}
export default class Playlists extends Component<any, IState> {
  db!: RxDatabase<Database.DatabaseCollections>;
  sub!: Subscription;
  state: IState = {
    playlists: []
  };

  componentDidMount() {
    this.initialize();
  }

  async initialize() {
    this.db = await Database.get();
    this.sub = this.db.playlists.$.subscribe((_change) => {
      this.fetchPlaylists();
    });
  }

  async fetchPlaylists() {
    const playlists = await this.db.playlists.find({ name: { $exists: true } }).exec();
    this.setState({ playlists });
  }

  async selectPlaylist(playlist: PlaylistProps) {
    await this.db.playlists.upsertLocal("current", { playlist: playlist.id });
  }

  render() {
    return (
      <div>
        <h5>Playlists</h5>
        {
          this.state.playlists.map((playlist) => {
            return (
              <div
                style={{
                  padding: 10,
                  margin: 10,
                  border: "1px solid blue"
                }}
                key={playlist.id}
                onClick={() => this.selectPlaylist(playlist)}>
                {playlist.name}
              </div>
            );
          })
        }
      </div>
    );
  }

}
