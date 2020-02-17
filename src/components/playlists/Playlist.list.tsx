import React, { useState, useEffect, useContext } from "react";
import { Pane, Heading, IconButton } from "evergreen-ui";
import { RxDocument } from "rxdb";
import CorgialContext from "../../Corgial.Context";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";
import { navigate } from "hookrouter";
import { PlaylistItem } from "./Playlist.item";

export const PlaylistList: React.FC<{}> = () => {
  const context = useContext(CorgialContext);
  const [playlists, setPlaylists] = useState<RxDocument<PlaylistProps>[]>([]);

  useEffect(() => {
    let ignore = false;
    const fetchPlaylists = async () => {
      if (context.db) {
        const dbplaylists = await context.db.playlists.find().exec();
        const lastAdded: any = { cid: "last", title: "Last Added" };
        dbplaylists.unshift(lastAdded);
        !ignore && setPlaylists(dbplaylists);
      }
    };
    fetchPlaylists();
    context.setPlaylist({ title: "Last Added" });
    context.setQuery({});
    return () => {
      ignore = true;
    };
  }, [context]);

  return (
    <Pane
      gridArea="main"
      display="grid"
      gridAutoColumns="1fr"
      gridAutoRows={72}
      boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)"
      position="relative"
      zIndex={8}
    >
      <Pane
        display="flex"
        boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)"
        justifyContent="space-between"
        alignItems="center"
        padding={16}
      >
        <Heading size={600}>Playlists</Heading>
        <IconButton
          height={36}
          icon="plus"
          intent="success"
          appearance="minimal"
          onClick={() => navigate("/library/playlists/new")}
        />
      </Pane>
      {playlists.map(list => {
        return <PlaylistItem key={list.cid} list={list} />;
      })}
    </Pane>
  );
};
