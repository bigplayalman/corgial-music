import React, { useContext, useEffect, useState } from "react";
import { Pane } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";

export const Player: React.FC = () => {
  const context = useContext(CorgialContext);
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    const sub = context.getStore("filename").subscribe(({ filename }) => {
      setUrl(filename);
    });
    return () => {
      sub.unsubscribe();
    };
  }, [context]);

  return (
    <Pane
      gridArea="player"
      background="greenTint"
      boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)"
      position="relative"
      zIndex={20}
    >
      {url && <audio src={`https://${url}`} autoPlay={true} controls />}
    </Pane>
  );
};
