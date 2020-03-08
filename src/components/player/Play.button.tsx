import React, { useContext, useState, useEffect, Fragment } from "react";
import { IconButton } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";

export const PlayButton: React.FC = () => {
  const context = useContext(CorgialContext);
  const [playing, setPlaying] = useState<boolean>(false);
  const [canplay, setCanPlay] = useState<boolean>(false);

  useEffect(() => {
    const playingSub = context.music.getStateProp("playing").subscribe((state: any) => {
      setPlaying(state);
    });
    const canPlaySub = context.music.getStateProp("canplay").subscribe((state: any) => {
      setCanPlay(state);
    });
    return () => {
      canPlaySub.unsubscribe();
      playingSub.unsubscribe();
    };
  }, [context]);

  return (
    <Fragment>
      {
        playing ?
          <IconButton icon="pause" margin={8} onClick={() => context.music.pause()}/>
          :
          <IconButton icon="play" margin={8} disabled={!canplay} onClick={() => context.music.play()}/>
      }
    </Fragment>
  );
};
