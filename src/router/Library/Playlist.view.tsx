import React from "react";
import { PlaylistList } from "../../components/playlists/Playlist.list";
import { TrackList } from "../../components/tracks/Track.list";
import { Pane } from "evergreen-ui";

export const PlaylistView: React.FC = () => {
  return (
    <Pane display="grid" gridTemplateColumns="1fr 1fr" height="100%">
      <Pane height="100%" overflowY="auto">
        <PlaylistList />
      </Pane>
      <Pane height="100%" overflowY="auto" boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)">
        <TrackList />
      </Pane>
    </Pane>
  );
};