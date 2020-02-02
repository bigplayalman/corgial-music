import React, { useState, useEffect, useContext } from "react";
import { Pane, Heading, IconButton } from "evergreen-ui";
import { RxDocument } from "rxdb";
import CorgialContext from "../../Corgial.Context";
import { SongProps } from "../../rxdb/schemas/song.schema";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";

export interface ISongList {
  cid?: string;
}

export const SongsList: React.FC<ISongList> = ({ cid }) => {
  const context = useContext(CorgialContext);
  const [playlist, setPlaylist] = useState<Partial<PlaylistProps>>({ title: "Last Added Songs" });
  const [songs, setSongs] = useState<RxDocument<SongProps>[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      if (context.db) {
        const dbsongs =
          cid ?
            await context.db.songs.find().where("playlists").elemMatch(cid).exec()
            :
            await context.db.songs.find().exec();
        setSongs(dbsongs);
      }
    };

    const fetchPlaylist = async () => {
      if (context.db && cid) {
        const dbplaylist = await context.db.playlists.findOne(cid).exec();
        if (dbplaylist) {
          const dbsongs = await dbplaylist.populate("songs") as RxDocument<SongProps>[];
          setSongs(dbsongs);
          setPlaylist(dbplaylist);
        }
      }
    };

    fetchSongs();
    fetchPlaylist();
  }, [context, playlist, cid]);

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
      boxShadow="1px 0px 2px rgba(0, 0, 0, 0.25)"
    >
      <Pane
        display="flex"
        boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)"
        justifyContent="space-between"
        alignItems="center"
        padding={16}
      >
        <Heading size={600}>
          {playlist.title}
        </Heading>
      </Pane>
      {
        songs.map((song) => {
          return (
            <Pane
              key={song.cid}
              display="flex"
              border="default"
              justifyContent="space-between"
              alignItems="center"
              padding={8}
              margin={8}
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
