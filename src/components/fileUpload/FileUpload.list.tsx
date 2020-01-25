import React, { useEffect, useState } from "react";
import * as mm from "music-metadata-browser";
import { Pane } from "evergreen-ui";

export interface IFileUploadList {
  files: File[];
}

export const FileUploadList: React.FC<IFileUploadList> = ({ files }) => {
  const [children, setChildren] = useState<{ metadata: mm.IAudioMetadata, file: File }[]>([]);
  useEffect(() => {
    const c: { metadata: mm.IAudioMetadata, file: File }[] = [];
    const parseData = async () => {
      for (const file of files) {
        const metadata = await mm.parseBlob(file);
        c.push({ file, metadata });
      }
      setChildren(c);
    };
    parseData();
  }, [files]);
  return (
    <Pane
      flex={1}
      clearfix={true}>
      {
        children.map(({ file, metadata }) => {
          return (
            <Pane
              key={file.name}
              elevation={1}
              background="tealTint"
              display="grid"
              gridTemplateColumns="50px 1fr"
              gridTemplateRows="50px"
            >
              <Pane>
                image
              </Pane>
              <Pane>
                {metadata.common.title || file.name}
              </Pane>
            </Pane>
          );
        })
      }
    </Pane>
  );
};
