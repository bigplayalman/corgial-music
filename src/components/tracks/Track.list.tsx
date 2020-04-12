import React, { useState, useEffect, useContext, ChangeEvent } from "react";
import { Pane, SearchInput } from "evergreen-ui";
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
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    let ignore = false;
    const filterQueue = (response: RxDocument<SongProps, {}>[]) => {
      if (search.length) {
        const filtered = response.filter((value: any) => {
          for (const prop in value) {
            if (typeof value[prop] === "string" && value[prop].includes(search)) {
              return true;
            }
          }
          return false;
        });
        return !ignore && setQueue(filtered || response);
      }
      return setQueue(response);
    };
    const getQueue = async () => {
      const response = await context.db.songs.find(query || {}).exec();
      filterQueue(response);
    };
    getQueue();
    const sub = context.db.songs.$.subscribe(() => {
      getQueue();
    });
    return () => {
      ignore = true;
      sub.unsubscribe();
    };
  }, [query, context, search]);

  return (
    <Pane
      display="grid"
      gridAutoRows={64}
      height="100%"
      maxHeight="100%"
      overflowY="auto"
      boxShadow={shadow}
    >
      <Pane
        display="flex"
        border="default"
        alignItems="center"
        padding={16}>
        <SearchInput
          placeholder="Filter tracks..."
          width="100%" value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} />
      </Pane>
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
