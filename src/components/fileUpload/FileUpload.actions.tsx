import React from "react";

export interface IFileUploadActions {
  successfullUploaded: boolean;
  setFiles: (files: File[]) => void;
  setSuccessfullUploaded: (status: boolean) => void;
  files: File[];
  uploading: boolean;
  uploadFiles: () => void;
}

export const FileUploadActions: React.FC<IFileUploadActions> = (
  { successfullUploaded,
    setFiles,
    setSuccessfullUploaded,
    files,
    uploading,
    uploadFiles
  }) => {
  return (
    <div className="Actions">
      {
        successfullUploaded ?
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
          :
          <button
            disabled={files.length < 0 || uploading}
            onClick={uploadFiles}
          >
            Upload
      </button>

      }
    </div>
  );
};
