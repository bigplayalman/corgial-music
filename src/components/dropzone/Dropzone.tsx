import React, {createRef, useState } from "react";
import "./dropzone.scss";

export interface DropzoneProps {
  disabled: boolean;
  onFilesEvent: (files: File[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({disabled, onFilesEvent}) => {
  const fileInputRef = createRef<any>();
  const [hightlight, setHighlight] = useState<boolean>(false);
  const openFileDialog = () => {
    console.log("clicked");
    if (disabled) {
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFilesAdded = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = evt.target.files;
    if (onFilesEvent && files) {
      const array = fileListToArray(files);
      onFilesEvent(array);
    }
  };

  const onDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();

    if (disabled) return;

    setHighlight(false);
  };

  const onDragLeave = () => {
    setHighlight(false);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (disabled) return;

    const files = event.dataTransfer.files;
    if (onFilesEvent) {
      const array = fileListToArray(files);
      onFilesEvent(array);
    }
    setHighlight(false);
  };

  const fileListToArray = (list: FileList) => {
    const array = [];
    for (let i = 0; i < list.length; i++) {
      const item = list.item(i);
      if (item) {
        array.push(item);
      }
    }
    return array;
  };

  return (
    <div
      className={`Dropzone ${hightlight ? "Highlight" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={openFileDialog}
      style={{ cursor: disabled ? "default" : "pointer" }}
    >
      <input
        ref={fileInputRef}
        className="FileInput"
        type="file"
        multiple
        onChange={onFilesAdded}
      />
      {/* <img
        alt="upload"
        className="Icon"
        src="baseline-cloud_upload-24px.svg"
      /> */}
      <span>Drag and Drop Files or click to show dialog</span>
    </div>
  );
};
