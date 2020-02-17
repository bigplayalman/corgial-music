import React, { useState, useEffect, useContext } from "react";
import { Pane, Heading, Alert } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";
import { SongProps } from "../../rxdb/schemas/song.schema";

interface SonglistProps {
  cid?: string;
}
export const SongsList: React.FC<SonglistProps> = ({ cid }) => {
  const context = useContext(CorgialContext);
  const [queue, setQueue] = useState<SongProps[]>([]);
  const [playlist, setPlaylist] = useState<{ title: string }>();

  useEffect(() => {
    let ignore = false;
    const fetchPlaylist = async () => {
      const dblist = await context.db.playlists.findOne({ cid }).exec();
      if (dblist) {
        !ignore && setPlaylist(dblist);
      } else {
        !ignore && setPlaylist({ title: "All Tracks" });
      }
    };
    cid === "last" ? setPlaylist({ title: "Last Added" }) : fetchPlaylist();
    const fetchSongs = async (query: any = {}) => {
      const songs = await context.db.songs.find(query).exec();
      !ignore && setQueue(songs);
    };
    const sub = context.getStore("query").subscribe(state => {
      for (const value in state) {
        switch (value) {
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
  }, [context, cid]);

  const selectSong = (filename: string) => {
    context.getSong(filename);
  };

  return (
    <Pane gridArea="detail" display="grid" overflowY="auto">
      <Pane
        display="flex"
        justifyContent="space-between"
        borderBottom="default"
        alignItems="center"
        padding={16}
        height={72}
      >
        <Heading size={600}>{playlist && playlist.title}</Heading>
      </Pane>
      <Pane
        display="grid" gridTemplateColumns="1fr" gridAutoRows={72} overflowY="auto"
      >
        {queue.length ? (
          queue.map((song: SongProps) => {
            return (
              <Pane
                key={song.cid}
                flex="0 0 72px"
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
            // height={72}
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
    </Pane>
  );
};
