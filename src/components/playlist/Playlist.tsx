import React, { useState, useEffect, useContext } from "react";
import { Pane, Spinner } from "evergreen-ui";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";
import CorgialContext from "../../Corgial.Context";

interface IPlayList {
  name: string;
}

export const Playlist: React.FC<IPlayList> = ({ name }) => {

  const [playlist, setPlaylist] = useState<PlaylistProps>();
  const context = useContext(CorgialContext);

  useEffect(() => {
    const getPlaylist = async () => {
      const response = await context.db.playlists.findOne({ name }).exec();
      if (response) {
        setPlaylist(response);
      }
    };
    getPlaylist();
  }, [context]);

  if (!playlist) {
    return <Spinner />;
  }

  return (
    <Pane elevation={1} padding={24} margin={24}>
      <Pane>
        {playlist.name} | {playlist.count} songs.
      </Pane>
      {
        playlist.songs.map((song) => {
          return (
            <Pane>
              {song}
            </Pane>
          );
        })
      }
    </Pane>
  );
};
