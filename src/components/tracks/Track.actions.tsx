import React, { SyntheticEvent } from "react";
import { IconButton } from "evergreen-ui";
import { SongProps } from "../../rxdb/schemas/song.schema";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";
import { RxDocument } from "rxdb";

interface TrackActionsProps {
  track: RxDocument<SongProps>;
  playlist: RxDocument<PlaylistProps>;
}
export const TrackActions: React.FC<TrackActionsProps> = ({
  track,
  playlist
}) => {
  const addTrack = async (e: SyntheticEvent) => {
    e.stopPropagation();
    const update = track.toJSON();
    update.playlists.push(playlist.cid);
    await track.update(update);
  };

  const removeTrack = async (e: SyntheticEvent) => {
    e.stopPropagation();
    const update = track.toJSON();
    update.playlists = update.playlists.filter((p) => p !== playlist.cid);
    await track.update(update);
  };

  if (track.playlists && track.playlists.find(list => list === playlist.cid)) {
    return <IconButton appearance="minimal" icon="minus" onClick={(e: SyntheticEvent) => removeTrack(e)}/>;
  }
  return <IconButton appearance="minimal" icon="plus" onClick={(e: SyntheticEvent) => addTrack(e)}/>;
};
