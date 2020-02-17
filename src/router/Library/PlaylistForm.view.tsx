import React, { Fragment } from "react";
import { PlaylistForm } from "../../components/playlists/Playlist.form";
import { TrackList } from "../../components/tracks/Track.list";

interface PlaylistFormViewProps {
  cid: string;
}
export const PlaylistFormView: React.FC<PlaylistFormViewProps> = ({ cid }) => {
  return (
    <Fragment>
      <PlaylistForm cid={cid} />
      <TrackList />
    </Fragment>
  );
};
