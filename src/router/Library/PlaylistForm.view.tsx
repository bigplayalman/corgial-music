import React, { Fragment } from "react";
import { PlaylistForm } from "../../components/playlists/Playlist.form";
import { SongsList } from "../../components/songs/Songs.list";

interface PlaylistFormViewProps {
  cid: string;
}
export const PlaylistFormView: React.FC<PlaylistFormViewProps> = ({ cid }) => {
  return (
    <Fragment>
      <PlaylistForm cid={cid} />
      <SongsList />
    </Fragment>
  );
};
