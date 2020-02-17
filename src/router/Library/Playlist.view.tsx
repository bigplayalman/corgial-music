import React from "react";
import { PlaylistList } from "../../components/playlists/Playlist.list";
import { Pane } from "evergreen-ui";
import { SongsList } from "../../components/songs/Songs.list";

export const PlaylistView: React.FC = () => {
  return (
    <Pane display="grid" gridTemplateColumns=".5fr .5fr" gridTemplate="1fr">
      <PlaylistList />
      <SongsList />
    </Pane>
  );
};
