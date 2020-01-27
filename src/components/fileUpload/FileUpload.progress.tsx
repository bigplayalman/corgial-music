import React, { useContext, useEffect, useState } from "react";
import { Pane } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";

export interface IFileUploadProgress {
  files: File[];
}

export const FileUploadProgress: React.FC<IFileUploadProgress> = ({ files }) => {
  const context = useContext(CorgialContext);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  useEffect(() => {
    const sub = context.events.subscribe((event) => {
      if (event.type === "FILES_PROGRESS") {
        switch (event.payload) {
          case "reset": setUploadProgress([]); break;
          case "add": {
            const progress = uploadProgress.concat(event.payload);
            setUploadProgress(progress);
          }
        }
      }
    });

    return () => {
      sub.unsubscribe();
    };

  }, [context, uploadProgress]);
  return (
    <Pane background="overlay" margin={24} display="flex" height={20} width="100%" alignItems="stretch">
      {
        uploadProgress.map((value, index) => {
          return (
            <Pane key={value + index} background="greenTint" width={`${100 / files.length}%`} />
          );
        })
      }
    </Pane>
  );
};
