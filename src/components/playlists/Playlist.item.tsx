import React, { useContext, useState, useEffect } from "react";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";
import { Pane, Heading, IconButton } from "evergreen-ui";
import { navigate } from "hookrouter";
import CorgialContext from "../../Corgial.Context";
import { RxDocument } from "rxdb";

export interface PlaylistItemProps {
  list: PlaylistProps;
}

export const PlaylistItem: React.FC<PlaylistItemProps> = ({ list }) => {
  const context = useContext(CorgialContext);
  const [playlist, setPlaylist] = useState<RxDocument<PlaylistProps>>();

  useEffect(() => {
    let ignore = false;
    const sub = context.getStore("playlist").subscribe(state => {
      !ignore && setPlaylist(state.playlist);
    });
    return () => {
      ignore = true;
      sub.unsubscribe();
    };
  }, [context]);

  const selectPlaylist = () => {
    if (list.cid === "last") {
      context.setPlaylist({ title: "Last Added" });
      context.setQuery({});
    } else {
      context.setPlaylist(list);
      context.setQuery({ playlists: { $elemMatch: list.cid } });
    }
  };

  return (
    <Pane
      background={
        list.title === (playlist && playlist.title) ? "yellowTint" : "tint2"
      }
      display="flex"
      border="default"
      justifyContent="space-between"
      alignItems="center"
      padding={8}
      onClick={() => selectPlaylist()}
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
};
