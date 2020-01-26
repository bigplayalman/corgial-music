import React from "react";
import { Button, Pane } from "evergreen-ui";

export interface IFileUploadActions {
  setFiles: (files: File[]) => void;
  setSuccessfullUploaded: (status: boolean) => void;
  files: File[];
  uploading: boolean;
  uploadFiles: () => void;
}

export const FileUploadActions: React.FC<IFileUploadActions> = (
  {
    setFiles,
    setSuccessfullUploaded,
    files,
    uploading,
    uploadFiles
  }
) => {
  if (!files.length) {
    return <div />;
  }
  return (
    <Pane>
      <Button
        marginRight={16}
        height={40}
        onClick={
          () => {
            setFiles([]);
            setSuccessfullUploaded(false);
          }
        }
      >
        Clear
      </Button>
      <Button
        height={40}
        disabled={files.length < 0 || uploading}
        onClick={uploadFiles}
      >
        Upload
      </Button>
    </Pane>
  );
};
