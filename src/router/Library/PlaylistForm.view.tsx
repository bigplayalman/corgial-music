import React from "react";
import { Pane } from "evergreen-ui";
import { PlaylistForm } from "../../components/playlists/Playlist.form";
import { SongsList } from "../../components/songs/Songs.list";

interface PlaylistFormViewProps {
  cid: string;
}
export const PlaylistFormView: React.FC<PlaylistFormViewProps> = ({ cid }) => {
  return (
    <Pane display="grid" gridTemplateColumns=".5fr .5fr" gridTemplate="1fr">
      <PlaylistForm cid={cid} />
      <SongsList />
    </Pane>
  );
};
