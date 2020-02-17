import React, { useState, useEffect, useContext } from "react";
import { Pane, Heading, IconButton } from "evergreen-ui";
import { RxDocument } from "rxdb";
import CorgialContext from "../../Corgial.Context";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";
import { navigate } from "hookrouter";

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
    return () => {
      ignore = true;
    };
  }, [context]);

  const selectPlaylist = (id: string) => {
    if (id === "last") {
      context.setPlaylist({ title: "Last Added" });
    }
  };

  return (
    <Pane
      display="grid"
      gridAutoColumns=".5fr"
      gridAutoRows="70px"
      boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)"
      position="relative"
      zIndex={8}
    >
      <Pane
        gridColumn="1 / span 2"
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
          onClick={() => navigate("/library/playlists/new")}
        />
      </Pane>
      {playlists.map(playlist => {
        return (
          <Pane
            key={playlist.cid}
            display="flex"
            border="default"
            justifyContent="space-between"
            alignItems="center"
            padding={8}
            margin={8}
          >
            <Heading size={500}>{playlist.title}</Heading>
            <IconButton
              height={24}
              icon="play"
              intent="success"
              onClick={() => selectPlaylist(playlist.cid)}
            />
          </Pane>
        );
      })}
    </Pane>
  );
};
