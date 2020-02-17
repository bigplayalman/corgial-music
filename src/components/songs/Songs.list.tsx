import React, { useState, useEffect, useContext } from "react";
import { Pane, Heading, Alert } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";
import { SongProps } from "../../rxdb/schemas/song.schema";

export const SongsList: React.FC = () => {
  const context = useContext(CorgialContext);
  const [queue, setQueue] = useState<SongProps[]>([]);
  const [playlist, setPlaylist] = useState<{ title: string }>();

  useEffect(() => {
    let ignore = false;
    const fetchSongs = async (query: any = {}) => {
      console.log("query", query);
      const songs = await context.db.songs.find(query).exec();
      !ignore && setQueue(songs);
    };
    const sub = context.getStore(["query", "playlist"]).subscribe(state => {
      for (const value in state) {
        switch (value) {
          case "playlist":
            setPlaylist(state[value]);
            break;
          case "query": {
            fetchSongs(state[value]);
          }
        }
      }
    });

    return () => {
      ignore = true;
      sub.unsubscribe();
    };
  }, [context]);

  const selectSong = (filename: string) => {
    context.getSong(filename);
  };

  return (
    <Pane display="grid" gridAutoColumns="1fr" gridAutoRows={72}>
      <Pane
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={16}
      >
        <Heading size={600}>{playlist && playlist.title}</Heading>
      </Pane>
      {queue.length ? (
        queue.map((song: SongProps) => {
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
        })
      ) : (
        <Pane
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding={8}
        >
          <Alert
            appearance="card"
            intent="none"
            title="No songs available"
            width="100%"
            marginTop={32}
            marginBottom={32}
          />
        </Pane>
      )}
    </Pane>
  );
};
