import React, { SyntheticEvent } from "react";
import { IconButton } from "evergreen-ui";
import { SongProps } from "../../rxdb/schemas/song.schema";
import { RxDocument } from "rxdb";

interface TrackActionsProps {
  track: RxDocument<SongProps>;
  playlist: string;
}
export const TrackActions: React.FC<TrackActionsProps> = ({
  track,
  playlist
}) => {
  const addTrack = async (e: SyntheticEvent) => {
    e.stopPropagation();
    const update = track.toJSON();
    update.playlists.push(playlist);
    await track.update(update);
  };

  const removeTrack = async (e: SyntheticEvent) => {
    e.stopPropagation();
    const update = track.toJSON();
    update.playlists = update.playlists.filter((p) => p !== playlist);
    await track.update(update);
  };

  if (track.playlists && track.playlists.find(list => list === playlist)) {
    return <IconButton appearance="minimal" icon="minus" onClick={(e: SyntheticEvent) => removeTrack(e)}/>;
  }
  return <IconButton appearance="minimal" icon="plus" onClick={(e: SyntheticEvent) => addTrack(e)}/>;
};
