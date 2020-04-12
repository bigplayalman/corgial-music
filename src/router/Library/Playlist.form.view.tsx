import React, { useEffect, useState } from "react";
import { TrackList } from "../../components/tracks/Track.list";
import { Pane } from "evergreen-ui";
import { PlaylistForm } from "../../components/playlists/playlist.form";

interface PlaylistFormViewProps {
  cid: string;
}
export const PlaylistFormView: React.FC<PlaylistFormViewProps> = ({ cid }) => {
  const [query, setQuery] = useState<any>();
  const [notQuery, setNotQuery] = useState<any>();

  useEffect(() => {
    const q = cid ? { playlists: { $elemMatch: { $eq: cid } } } : null;
    const n = cid ? { $not: { playlists: { $elemMatch: { $eq: cid } } } } : null;
    setQuery(q);
    setNotQuery(n);
  }, [cid]);

  return (
    <Pane display="grid" gridTemplateColumns="1fr" height="100%" gridTemplateRows="auto 1fr">
      <PlaylistForm cid={cid} />
      <Pane height="100%" overflowY="auto" display="grid" gridTemplateColumns="1fr 1fr">
        <TrackList playlist={cid} query={query} />
        <TrackList playlist={cid} query={notQuery} shadow="0px 0px 2px rgba(0, 0, 0, 0.25)" />
      </Pane>
    </Pane>
  );
};
