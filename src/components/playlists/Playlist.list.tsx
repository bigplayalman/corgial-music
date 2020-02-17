import React, { useState, useEffect, useContext } from "react";
import { Pane, Heading, IconButton } from "evergreen-ui";
import { RxDocument } from "rxdb";
import CorgialContext from "../../Corgial.Context";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";
import { navigate } from "hookrouter";

export const PlaylistList: React.FC<{}> = () => {
  const context = useContext(CorgialContext);
  const [playlists, setPlaylists] = useState<RxDocument<PlaylistProps>[]>([]);
  const [playlist, setPlaylist] = useState<RxDocument<PlaylistProps>>();

  useEffect(() => {
    let ignore = false;
    const sub = context.getStore("playlist").subscribe(state => {
      setPlaylist(state.playlist);
    });
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
      sub.unsubscribe();
    };
  }, [context]);

  const selectPlaylist = (list: PlaylistProps) => {
    if (list.cid === "last") {
      context.setPlaylist({ title: "Last Added" });
      context.setQuery({});
    } else {
      context.setPlaylist(list);
      context.setQuery({playlists: { $elemMatch: list.cid }});
    }
  };

  return (
    <Pane
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
        return (
          <Pane
            key={list.cid}
            background={
              list.title === (playlist && playlist.title)
                ? "yellowTint"
                : "tint2"
            }
            display="flex"
            border="default"
            justifyContent="space-between"
            alignItems="center"
            padding={8}
            onClick={() => selectPlaylist(list)}
          >
            <Heading size={500}>{list.title}</Heading>
            {list.cid !== "last" && (
              <IconButton
                height={36}
                icon="edit"
                appearance="minimal"
                intent="warning"
                onClick={() => navigate(`/library/playlists/${list.cid}`)}
              />
            )}
          </Pane>
        );
      })}
    </Pane>
  );
};
