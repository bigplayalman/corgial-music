import React, { Fragment } from "react";
import { PlaylistList } from "../../components/playlists/Playlist.list";
import { SongsList } from "../../components/songs/Songs.list";

export const PlaylistView: React.FC = () => {
  return (
    <Fragment>
      <PlaylistList />
      <SongsList />
    </Fragment>
  );
};
