import React, { useState, useEffect, useContext } from "react";
import { Pane } from "evergreen-ui";
import { SongProps } from "../rxdb/schemas/song.schema";
import { RxDocument } from "rxdb";
import CorgialContext from "../Corgial.Context";

export const Library: React.FC<{}> = () => {
  const context = useContext(CorgialContext);
  const [songs, setSongs] = useState<RxDocument<SongProps>[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const music = await context.db.songs.find().exec();
      setSongs(music);
    };
    fetchSongs();
  }, [context.db.songs]);

  return (
    <Pane>
      {
        songs.map((song) => {
          return (
            <Pane key={song.id}>
              {song.title}
            </Pane>
          );
        })
      }
    </Pane>
  );
};
