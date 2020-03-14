import React, { useContext, useState, useEffect } from "react";
import { PlaylistList } from "../../components/playlists/Playlist.list";
import { TrackList } from "../../components/tracks/Track.list";
import { Pane } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";

export const PlaylistView: React.FC = () => {
  const context = useContext(CorgialContext);
  const [playlist, setPlaylist] = useState<PlaylistProps>({ title: "Latest Songs" });
  const [query, setQuery] = useState<any>();

  useEffect(() => {
    let ignore = false;
    const sub = context.getStore("playlist").subscribe((state) => {
      for (const value in state) {
        switch (value) {
          case "playlist": {
            !ignore && setPlaylist(state[value]);
            const q = state[value].cid ? { playlists: { $elemMatch: { $eq: state[value].cid } } } : null;
            !ignore && setQuery(q);
            break;
          }
        }
      }
    });
    return () => {
      sub.unsubscribe();
      ignore = true;
    };
  }, [context]);

  return (
    <Pane display="grid" gridTemplateColumns="1fr 1fr" height="100%">
      <Pane height="100%" overflowY="auto">
        <PlaylistList />
      </Pane>
      <Pane height="100%" overflowY="auto" boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)">
        <TrackList playlist={playlist.cid} query={query} />
      </Pane>
    </Pane>
  );
};
