import React from "react";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";
import { Pane, Heading, IconButton } from "evergreen-ui";
import { navigate } from "hookrouter";

export interface PlaylistItemProps {
  list: PlaylistProps;
  selected?: PlaylistProps;
  onClick: (list: PlaylistProps) => void;
}

export const PlaylistItem: React.FC<PlaylistItemProps> = ({ list, selected, onClick }) => {

  return (
    <Pane
      background={
        list.title === (selected && selected.title) ? "yellowTint" : "tint2"
      }
      display="flex"
      border="default"
      justifyContent="space-between"
      alignItems="center"
      padding={8}
      onClick={() => onClick(list)}
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
