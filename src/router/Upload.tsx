import React from "react";
import { Pane, Heading } from "evergreen-ui";
import { FileUpload } from "../components/fileUpload/FileUpload";

export const Upload: React.FC<{}> = () => {

  return (
    <Pane display="flex" flexDirection="column" background="overlay" padding={16}>
      <Pane flex="0" padding={8}>
        <Heading size={600}>Upload Music</Heading>
      </Pane>
      <Pane flex="1" elevation={1} display="flex">
        <FileUpload />
      </Pane>
    </Pane>
  );
};
