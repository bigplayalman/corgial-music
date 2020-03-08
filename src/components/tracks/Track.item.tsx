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
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      boxShadow="0 0px 1px rgba(0, 0, 0, 0.2)"
      marginBottom={1}
      padding={8}
      background={currentSong === tr.cid ? "greenTint" : "blueTint"}
      onClick={() => selectSong(tr)}
    >
      <Heading size={500}>{tr.title}</Heading>
      {children}
    </Pane>
  );
};
