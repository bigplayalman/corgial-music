import React from "react";
import { Pane } from "evergreen-ui";
import { FileUpload } from "../components/fileUpload/FileUpload";

export const Upload: React.FC<{}> = () => {
  return (
    <Pane display="flex" background="purpleTint" padding={16}>
      <FileUpload />
    </Pane>
  );
};
