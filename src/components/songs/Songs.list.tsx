import React, { useState, useEffect, useContext } from "react";
import { Pane, Heading } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";
import { SongProps } from "../../rxdb/schemas/song.schema";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";

export const SongsList: React.FC = () => {
  const context = useContext(CorgialContext);
  const [queue, setQueue] = useState<SongProps[]>([]);
  const [playlist, setPlaylist] = useState<{ title: string }>();

  useEffect(() => {
    const sub = context.getStore(["queue", "playlist"]).subscribe(state => {
      for (const value in state) {
        switch (value) {
          case "playlist":
            const list = state[value] as PlaylistProps;
            setPlaylist(list);
            list.cid
              ? context.fetchSongs({ playlists: { $elemMatch: list.cid } })
              : context.fetchSongs();
            break;
          case "queue": {
            setQueue((state[value] as SongProps[]) || []);
            break;
          }
        }
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [context]);

  const selectSong = (filename: string) => {
    context.getSong(filename);
  };

  return (
    <Pane display="grid" gridAutoColumns="1fr" gridAutoRows="70px">
      <Pane
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={16}
      >
        <Heading size={600}>{playlist && playlist.title}</Heading>
      </Pane>
      {queue.map((song: SongProps) => {
        return (
          <Pane
            key={song.cid}
            display="flex"
            border="default"
            justifyContent="space-between"
            alignItems="center"
            padding={8}
            onClick={() => selectSong(song.filename)}
          >
            <Heading size={500}>{song.title}</Heading>
          </Pane>
        );
      })}
    </Pane>
  );
};
