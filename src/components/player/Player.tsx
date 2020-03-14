import React, { useContext, useEffect, useState } from "react";
import { Pane, IconButton } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";
import { SongProps } from "../../rxdb/schemas/song.schema";
import { PlayButton } from "./Play.button";
import { PreviousButton } from "./Previous.button";
import { Subscription } from "rxjs";

export const Player: React.FC = () => {
  const context = useContext(CorgialContext);
  const [track, setTrack] = useState<SongProps>();

  useEffect(() => {
    let audio: Subscription;
    const state = context.getStore(["track", "filename"]).subscribe((store) => {
      for (const value in store) {
        switch (value) {
          case "track": setTrack(store[value]); break;
          case "filename": {
            audio = context.music.playStream(store[value]).subscribe();
            break;
          }
        }
      }
    });
    return () => {
      state.unsubscribe();
      return audio && audio.unsubscribe();
    };
  }, [context]);

  return (
    <Pane
      height="100%"
      background="greenTint"
      boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)">
      {
        track &&
        <Pane>
          {track.title}
        </Pane>
      }

      <Pane display="flex" padding={8} justifyContent="center">
        <PreviousButton />
        <PlayButton />
        <IconButton icon="step-forward" margin={8} />
      </Pane>
    </Pane>
  );
};
