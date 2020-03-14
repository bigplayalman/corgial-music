import React, { useState, useEffect, useContext } from "react";
import { Pane } from "evergreen-ui";
import { RxDocument } from "rxdb";
import CorgialContext from "../../Corgial.Context";
import { SongProps } from "../../rxdb/schemas/song.schema";
import { TrackItem } from "./Track.item";
import { TrackActions } from "./Track.actions";
import { NoItems } from "../noItems/noItems";

interface TrackListProps {
  playlist?: string;
  shadow?: string;
  query?: any;
}
export const TrackList: React.FC<TrackListProps> = ({ playlist, query, shadow }) => {
  const context = useContext(CorgialContext);
  const [queue, setQueue] = useState<RxDocument<SongProps>[]>([]);

  useEffect(() => {
    let ignore = false;
    const getQueue = async () => {
      const response =  await context.db.songs.find(query || {}).exec();
      return !ignore && setQueue(response);
    };
    getQueue();
    const sub = context.db.songs.$.subscribe(() => {
      getQueue();
    });
    return () => {
      ignore = true;
      sub.unsubscribe();
    };
  }, [query, context]);

  return (
    <Pane
      display="grid"
      gridAutoRows={64}
      height="100%"
      maxHeight="100%"
      overflowY="auto"
      boxShadow={shadow}
    >
      {
        queue.length ? (
          queue.map(track => {
            return (
              <TrackItem key={track.cid} tr={track}>
                {playlist && (
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
  );
};
