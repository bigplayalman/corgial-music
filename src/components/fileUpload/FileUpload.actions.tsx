import React from "react";

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
    <div className="Actions">
      <button
        onClick={
          () => {
            setFiles([]);
            setSuccessfullUploaded(false);
          }
        }
      >
        Clear
      </button>
      <button
        disabled={files.length < 0 || uploading}
        onClick={uploadFiles}
      >
        Upload
      </button>
    </div>
  );
};
