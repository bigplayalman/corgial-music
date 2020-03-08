import React, { useEffect, useContext } from "react";
import { IconButton } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";

export const PreviousButton: React.FC = () => {
  const context = useContext(CorgialContext);

  useEffect(() => {
    const state = context.getStore(["queue", "track"]).subscribe((s) => {
      for (const value in s) {
        switch (value) {
          case "queue":
            console.log("queue", s[value]);
            break;
        }
      }
    });

    return () => {
      state.unsubscribe();
    };
  }, [context]);
  return (
    <IconButton icon="step-backward" margin={8} />
  );
};
