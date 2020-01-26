import React, { useState, useContext } from "react";
import { Dropzone } from "../dropzone/Dropzone";
// import { Subscription } from "rxjs";
// import { IPicture } from "music-metadata/lib/type";

import "./fileUpload.scss";
import { FileUploadActions, IFileUploadActions } from "./FileUpload.actions";
import { FileUploadList } from "./FileUpload.list";
import { Pane } from "evergreen-ui";
import { FileUploadProgress } from "./FileUpload.progress";
import CorgialContext from "../../Corgial.Context";

export const FileUpload: React.FC = () => {
  const context = useContext(CorgialContext);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: string[], error: string[] }>({done: [], error: []});
  const [successfullUploaded, setSuccessfullUploaded] = useState<boolean>(false);

  const onFilesAdded = (payload: File[]) => {
    const values = [...files, ...payload];
    setFiles(values);
  };

  const uploadFiles = async () => {
    setUploading(true);
    setUploadProgress({done: [], error: []});
    const promises: Promise<XMLHttpRequest | File>[] = [];
    files.forEach(file => {
      promises.push(sendRequest(file) as Promise<XMLHttpRequest | File>);
    });
    try {
      for (const promise of promises) {
        const response = await promise;
        await context.saveDetails(response as File);
      }
      console.log("all done");
      setSuccessfullUploaded(false);
      setUploading(false);
      setFiles([]);
    } catch (e) {
      setSuccessfullUploaded(false);
      setUploading(false);
    }
  };

  const sendRequest = (file: File) => {
    return new Promise<XMLHttpRequest | File>((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file, file.name);
      const req = new XMLHttpRequest();
      req.upload.addEventListener("load", (_event: ProgressEvent) => {
        const copy = { ...uploadProgress };
        copy.done.push(file.name);
        setUploadProgress(copy);
        resolve(file);
      });

      req.upload.addEventListener("error", (_event: ProgressEvent) => {
        const copy = { ...uploadProgress };
        copy.error.push(file.name);
        setUploadProgress(copy);
        reject(req.response);
      });

      req.open("POST", "http://localhost:3300/api/upload");
      req.send(formData);
    });
  };

  const fileUploadActionProps: IFileUploadActions = {
    setSuccessfullUploaded,
    files,
    setFiles,
    uploading,
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
        disabled={uploading || successfullUploaded}
      />
      <FileUploadList files={files} />
      <FileUploadProgress files={files} uploading={uploading} uploadProgress={uploadProgress}/>
      <FileUploadActions {...fileUploadActionProps} />
    </Pane>
  );
};
