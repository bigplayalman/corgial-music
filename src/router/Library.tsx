import React, { useEffect, useContext, useState } from "react";
import { Pane } from "evergreen-ui";
import { PlaylistList } from "../components/playlists/Playlist.list";
import { SongsList } from "../components/songs/Songs.list";
import CorgialContext from "../Corgial.Context";

export const Library: React.FC<{}> = () => {
  const context = useContext(CorgialContext);
  const [cid, setCid] = useState<string>();

  useEffect(() => {
    const sub = context.events.subscribe((event) => {
      if (event.type === "PLAYLIST_SELECT") {
        setCid(event.payload as string);
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [context]);

  return (
    <Pane
      display="grid"
      gridTemplateColumns=".5fr .5fr"
      gridTemplate="1fr"
    >
      <PlaylistList />
      <SongsList cid={cid} />
    </Pane>
  );
};
