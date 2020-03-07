import React from "react";
import { PlaylistForm } from "../../components/playlists/Playlist.form";
import { TrackList } from "../../components/tracks/Track.list";
import { Pane } from "evergreen-ui";

interface PlaylistFormViewProps {
  cid: string;
}
export const PlaylistFormView: React.FC<PlaylistFormViewProps> = ({ cid }) => {
  return (
    <Pane display="grid" gridTemplateColumns="1fr 1fr" height="100%">
      <Pane height="100%" overflowY="auto">
        <PlaylistForm cid={cid} />
      </Pane>
      <Pane height="100%" overflowY="auto" boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)">
        <TrackList />
      </Pane>
    </Pane>
  );
};
