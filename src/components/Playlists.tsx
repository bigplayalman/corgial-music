import React, { Component } from "react";
import Database from "../Database";
import { PlaylistProps } from "../rxdb/schemas/playlist.schema";
import { Subscription } from "rxjs";

interface IState {
  playlists: PlaylistProps[];
}
export default class Playlists extends Component<any, IState> {
  sub!: Subscription;
  state: IState = {
    playlists: []
  };

  componentDidMount() {
    this.initialize();
  }

  async initialize() {
    this.sub = Database.playlists.$.subscribe(async (_change) => {
      const playlists = await Database.playlists.find().exec();
      this.setState({ playlists });
    });
  }

  async selectPlaylist(playlist: any) {
    await Database.playlists.upsertLocal("current", { playlist: playlist.id });
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
