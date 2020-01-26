import React from "react";
import { Pane } from "evergreen-ui";

export interface IFileUploadList {
  files: File[];
}

export const FileUploadList: React.FC<IFileUploadList> = ({ files }) => {
  return (
    <Pane marginBottom={24}>
      <Pane elevation={1} padding={24} margin={24}>
        {files.length} Files.
      </Pane>
    </Pane>
  );
};
