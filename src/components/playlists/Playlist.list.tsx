import React, { useState, useEffect, useContext, Fragment } from "react";
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
    return () => {
      ignore = true;
    };
  }, [context]);

  return (
    <Fragment>
      <Pane
        display="flex"
        height={64}
        justifyContent="space-between"
        alignItems="center"
        padding={16}
        boxShadow="0 0px 1px rgba(0, 0, 0, 0.4)"
        marginBottom={1}
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
      <Pane
        display="grid"
        gridAutoRows={64}
        maxHeight="100%"
        overflowY="auto"
      >
        {
          playlists.map(list => {
            return <PlaylistItem key={list.cid} list={list} />;
          })
        }
      </Pane>

    </Fragment>
  );
};
