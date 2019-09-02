import React from "react";
import { PlayButton, Timer, Progress, NextButton, PrevButton, VolumeControl } from "react-soundplayer/components";
import { withCustomAudio } from "react-soundplayer/addons";
import "./Controls.scss";
import "react-soundplayer/styles/buttons.css";
import "react-soundplayer/styles/progress.css";
import "react-soundplayer/styles/volume.css";
import "react-soundplayer/styles/icons.css";

export const Controls = withCustomAudio((props: any) => {
  return (
    <div className="controls-container">
      <PrevButton className="previous" onPrevClick={() => props.previousSong()} />
      <PlayButton className="play" {...props} />
      <NextButton className="next" onNextClick={() => props.nextSong()} />
      <Progress className="progress" {...props} />
      <Timer className="timer" {...props} />
      <VolumeControl className="volume" {...props}/>
    </div>
  );
});
