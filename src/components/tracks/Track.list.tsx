import React, { useState, useEffect, useContext, Fragment } from "react";
import { Pane, Heading } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";
import { SongProps } from "../../rxdb/schemas/song.schema";
import { TrackItem } from "./Track.item";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";
import { TrackActions } from "./Track.actions";
import { RxDocument } from "rxdb";
import { NoItems } from "../noItems/noItems";

export const TrackList: React.FC = () => {
  const context = useContext(CorgialContext);
  const [queue, setQueue] = useState<RxDocument<SongProps>[]>([]);
  const [query, setQuery] = useState<any>({});
  const [playlist, setPlaylist] = useState<RxDocument<PlaylistProps>>();

  useEffect(() => {
    let ignore = false;
    const sub = context.getStore(["playlist"]).subscribe(state => {
      for (const value in state) {
        switch (value) {
          case "queue": {
            !ignore && setQueue(state[value]);
            break;
          }
          case "playlist": {
            !ignore && setPlaylist(state[value]);
            const cid = state[value].cid;
            const q = cid ? { playlists: { $elemMatch: { $eq: cid } } } : {};
            !ignore && setQuery(q);
            console.log("playlist", q, state[value]);
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
    <Fragment>
      <Pane
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={16}
        height={64}
        boxShadow="0 0px 1px rgba(0, 0, 0, 0.4)"
        marginBottom={1}
      >
        <Heading size={600}>{playlist && playlist.title}</Heading>
      </Pane>
      <Pane
        display="grid"
        gridAutoRows={64}
        height="100%"
        maxHeight="100%"
        overflowY="auto"
      >
        {
          queue.length ? (
            queue.map(track => {
              return (
                <TrackItem key={track.cid} tr={track}>
                  {playlist && playlist.cid && (
                    <TrackActions track={track} playlist={playlist} />
                  )}
                </TrackItem>
              );
            })
          ) : (
              <NoItems message="No songs Available" />
            )
        }
      </Pane>
    </Fragment>
  );
};
