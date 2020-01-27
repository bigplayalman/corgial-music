import React, { useState, useContext } from "react";
import { Dropzone } from "../dropzone/Dropzone";

import "./fileUpload.scss";
import { FileUploadActions, IFileUploadActions } from "./FileUpload.actions";
import { FileUploadList } from "./FileUpload.list";
import { Pane } from "evergreen-ui";
import { FileUploadProgress } from "./FileUpload.progress";
import CorgialContext from "../../Corgial.Context";

export const FileUpload: React.FC = () => {
  const context = useContext(CorgialContext);
  const [files, setFiles] = useState<File[]>([]);

  const onFilesAdded = (payload: File[]) => {
    const values = [...files, ...payload];
    setFiles(values);
  };

  const uploadFiles = () => {
    context.uploadFiles(files);
  };

  const fileUploadActionProps: IFileUploadActions = {
    files,
    setFiles,
    uploadFiles
  };

  return (
    <Pane
      flex={1}
      display="grid"
      margin={24}
      gridTemplateColumns="1fr"
    >
      <Dropzone
        onFilesEvent={onFilesAdded}
      />
      <FileUploadList files={files} />
      <FileUploadProgress files={files} />
      <FileUploadActions {...fileUploadActionProps} />
    </Pane>
  );
};
