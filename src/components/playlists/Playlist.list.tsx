import React, { useState, useEffect, useContext, Fragment } from "react";
import { Pane, Heading, IconButton } from "evergreen-ui";
import { RxDocument } from "rxdb";
import CorgialContext from "../../Corgial.Context";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";
import { navigate } from "hookrouter";
import { PlaylistItem } from "./Playlist.item";
import { actions } from "../../actions";

export const PlaylistList: React.FC<{}> = () => {
  const context = useContext(CorgialContext);
  const [playlists, setPlaylists] = useState<RxDocument<PlaylistProps>[]>([]);
  const [selected, setSelected] = useState<PlaylistProps>();

  useEffect(() => {
    let ignore = false;
    const fetchPlaylists = async () => {
      const dbplaylists = await context.db.playlists.find().exec();
      return !ignore && setPlaylists(dbplaylists);
    };
    fetchPlaylists();
    return () => {
      ignore = true;
    };
  }, [context]);

  const onClick = (playlist: PlaylistProps) => {
    setSelected(playlist);
    context.events.next({ type: actions.PLAYLIST_SET, payload: playlist });
  };

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
            return <PlaylistItem key={list.cid} list={list} onClick={onClick} selected={selected} />;
          })
        }
      </Pane>

    </Fragment>
  );
};
