import React, { useState, useEffect, useContext } from "react";
import { Pane, Heading } from "evergreen-ui";
import { RxDocument } from "rxdb";
import CorgialContext from "../../Corgial.Context";
import { SongProps } from "../../rxdb/schemas/song.schema";

export const SongsList: React.FC = () => {
  const context = useContext(CorgialContext);
  const [queue, setQueue] = useState<RxDocument<SongProps>[]>([]);
  const [playlist, setPlaylist] = useState<{ title: string }>();

  useEffect(() => {
    const sub = context.events.subscribe((event) => {
      switch (event.type) {
        case "SET_QUEUE": setQueue(event.payload as RxDocument<SongProps>[]); break;
        case "LAST_ADDED": setPlaylist({ title: "Last Added" }); break;
        case "SET_PLAYLIST": setPlaylist(event.payload); break;
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, [context]);

  const selectSong = (id: string) => {
    if (id === "last") {
      console.log("last added");
    }

  };

  return (
    <Pane
      display="grid"
      gridAutoColumns="1fr"
      gridAutoRows="70px"
    >
      <Pane
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={16}
      >
        <Heading size={600}>
          {playlist && playlist.title}
        </Heading>
      </Pane>
      {
        queue.map((song) => {
          return (
            <Pane
              key={song.cid}
              display="flex"
              border="default"
              justifyContent="space-between"
              alignItems="center"
              padding={8}
              onClick={() => selectSong(song.cid)}
            >
              <Heading size={500}>{song.title}</Heading>
            </Pane>
          );
        })
      }
    </Pane>
  );
};
