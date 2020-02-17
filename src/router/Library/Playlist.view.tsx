import React, { Fragment } from "react";
import { PlaylistList } from "../../components/playlists/Playlist.list";
import { TrackList } from "../../components/tracks/Track.list";

export const PlaylistView: React.FC = () => {
  return (
    <Fragment>
      <PlaylistList />
      <TrackList />
    </Fragment>
  );
};
