import React, { useContext } from "react";
import CorgialContext from "../../Corgial.Context";
import { Pane, Heading } from "evergreen-ui";
import { SongProps } from "../../rxdb/schemas/song.schema";

export interface TrackItemProps {
  track: SongProps;
}
export const TrackItem: React.FC<TrackItemProps> = ({track}) => {
  const context = useContext(CorgialContext);
  const selectSong = (filename: string) => {
    context.getSong(filename);
  };
  return (
    <Pane
      flex="0 0 72px"
      display="flex"
      border="default"
      justifyContent="space-between"
      alignItems="center"
      padding={8}
      onClick={() => selectSong(track.filename)}
    >
      <Heading size={500}>{track.title}</Heading>
    </Pane>
  );
};
