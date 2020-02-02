import React, { useState, useEffect, useContext } from "react";
import { Pane, Heading } from "evergreen-ui";
import { RxDocument } from "rxdb";
import CorgialContext from "../Corgial.Context";
import { PlaylistProps } from "../rxdb/schemas/playlist.schema";

export const Library: React.FC<{}> = () => {
  const context = useContext(CorgialContext);
  const [playlists, setPlaylists] = useState<RxDocument<PlaylistProps>[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (context.db) {
        const dbplaylists = await context.db.playlists.find().exec();
        setPlaylists(dbplaylists);
      }
    };
    fetchPlaylists();
  }, [context]);

  return (
    <Pane
      display="grid"
      gridAutoColumns=".25fr"
      gridAutoRows="100px"
    >
      <Pane
        border="default"
        padding={16}
        margin={16}
      >
        <Heading size={500}>Last Added</Heading>
      </Pane>
      {
        playlists.map((playlist) => {
          return (
            <Pane
              key={playlist.cid}
              border="default"
              padding={16}
              margin={16}
            >
              <Heading size={500}>{playlist.name}</Heading>
            </Pane>
          );
        })
      }
    </Pane>
  );
};
