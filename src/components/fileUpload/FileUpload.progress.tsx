import React, { Fragment } from "react";
import { Pane } from "evergreen-ui";

export interface IFileUploadProgress {
  files: File[];
  uploading: boolean;
  uploadProgress: { done: string[], error: string[] };
}

export const FileUploadProgress: React.FC<IFileUploadProgress> = ({ files, uploadProgress, uploading }) => {
  if (!uploading) {
    return <Fragment />;
  }
  console.log(uploadProgress);
  return (
    <Pane background="overlay" margin={24} display="block" height={20} width="100%" alignItems="stretch">
      {
        uploadProgress.done.map((value) => {
          return (
            <Pane key={value} background="greenTint" width={`${100 / files.length}%`} height="100%" />
          );
        })
      }
    </Pane>
  );
};
