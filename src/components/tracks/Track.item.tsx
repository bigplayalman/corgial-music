import React, { useContext, useEffect, useState } from "react";
import CorgialContext from "../../Corgial.Context";
import { Pane, Heading } from "evergreen-ui";
import { SongProps } from "../../rxdb/schemas/song.schema";

export interface TrackItemProps {
  tr: SongProps;
}
export const TrackItem: React.FC<TrackItemProps> = ({ tr, children }) => {
  const context = useContext(CorgialContext);
  const [currentSong, setCurrentSong] = useState<string>();
  useEffect(() => {
    const sub = context.getStore("track").subscribe(({ track }) => {
      setCurrentSong(track.cid);
    });
    return () => {
      sub.unsubscribe();
    };
  }, [context]);

  const selectSong = (t: SongProps) => {
    context.getSong(t);
  };
  return (
    <Pane
      flex="0 0 72px"
      display="flex"
      border="default"
      justifyContent="space-between"
      alignItems="center"
      padding={8}
      background={currentSong === tr.cid ? "greenTint" : "blueTint"}
      onClick={() => selectSong(tr)}
    >
      <Heading size={500}>{tr.title}</Heading>
      {children}
    </Pane>
  );
};
