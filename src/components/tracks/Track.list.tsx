import React, { useState, useEffect, useContext } from "react";
import { Pane, Heading, Alert } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";
import { SongProps } from "../../rxdb/schemas/song.schema";
import { TrackItem } from "./Track.item";

export const TrackList: React.FC = () => {
  const context = useContext(CorgialContext);
  const [queue, setQueue] = useState<SongProps[]>([]);
  const [playlist, setPlaylist] = useState<{ title: string }>();

  useEffect(() => {
    let ignore = false;
    const fetchSongs = async (query: any = {}) => {
      const songs = await context.db.songs.find(query).exec();
      !ignore && setQueue(songs);
    };
    const sub = context.getStore(["query", "playlist"]).subscribe(state => {
      for (const value in state) {
        switch (value) {
          case "query": {
            fetchSongs(state[value]);
            break;
          }
          case "playlist": {
            !ignore && setPlaylist(state[value]);
            break;
          }
        }
      }
    });
    return () => {
      ignore = true;
      sub.unsubscribe();
    };
  }, [context]);

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
          queue.map((track: SongProps) => {
            return <TrackItem key={track.cid} track={track} />;
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
