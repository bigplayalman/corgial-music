import React from "react";
import { Pane } from "evergreen-ui";
import { PlaylistList } from "../components/playlists/Playlist.list";
import { SongsList } from "../components/songs/Songs.list";

export const Library: React.FC<{}> = () => {
  return (
    <Pane
      display="grid"
      gridTemplateColumns=".5fr .5fr"
      gridTemplate="1fr"
    >
      <PlaylistList />
      <SongsList />
    </Pane>
  );
};
