import React from "react";

export interface IFileUploadList {
  files: File[];
}

export const FileUploadList: React.FC<IFileUploadList> = ({ files }) => {
  return (
    <div className="Files">
      {files.map(file => {
        return (
          <div key={file.name} className="Row">
            <span className="Filename">{file.name}</span>
          </div>
        );
      })}
    </div>
  );
};
