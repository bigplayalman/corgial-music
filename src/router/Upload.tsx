import React from "react";
import { Pane } from "evergreen-ui";
import { FileUpload } from "../components/fileUpload/FileUpload";

export const Upload: React.FC<{}> = () => {
  return (
    <Pane display="flex" flexDirection="column" background="purpleTint" padding={16}>
      <Pane flex="1" elevation={1} display="flex">
        <FileUpload />
      </Pane>
    </Pane>
  );
};
