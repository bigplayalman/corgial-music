import React, { useState, useEffect, useContext } from "react";
import { Pane, Heading, Text } from "evergreen-ui";
import { SongProps } from "../rxdb/schemas/song.schema";
import { RxDocument } from "rxdb";
import CorgialContext from "../Corgial.Context";
import defaultImage from "../svgs/defaultImage.svg";

export const Library: React.FC<{}> = () => {
  const context = useContext(CorgialContext);
  const [songs, setSongs] = useState<RxDocument<SongProps>[]>([]);

  useEffect(() => {
    const fetchSongs = async () => {
      if (context.db) {
        const music = await context.db.songs.find().sort("dateAdded").exec();
        setSongs(music);
      }
    };
    fetchSongs();
  }, [context]);

  return (
    <Pane>
      {
        songs.map((song) => {
          return (
            <Pane
              key={song.cid}
              display="grid"
              gridTemplateColumns="80px 1fr"
              gridAutoRows="60px"
              border="default"
              padding={16}
              margin={16}
            >
              <Pane>
                <img alt="album art" src={song.picture || defaultImage} className="responsive" />
              </Pane>
              <Pane paddingLeft={8}>
                <Heading size={400} marginTop={0}>
                  {song.title}
                </Heading>
                <Text>
                  {
                    song.artists && song.artists.map((artist) => `${artist} `)
                  }
                </Text>
              </Pane>
            </Pane>
          );
        })
      }
    </Pane>
  );
};
