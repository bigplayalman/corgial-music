import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import * as mm from "music-metadata-browser";
import Database from "./Database";
import { v4 } from "uuid";

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isDragActive) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props: any) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

export const FileUpload = (props?: any) => {

  /**
   * @param blob Blob (e.g. Web API File)
   */
  const readFromBlob = (blob: Blob) => {
    return mm.parseBlob(blob);
  };

  const onDrop = useCallback(acceptedFiles => {
    const handleFile = async (file: File) => {
      const metadata = await readFromBlob(file);
      const id = v4();
      const { title, artists, genre, album, year, picture } = metadata.common;
      const song = await Database.music.insert({
        id,
        title,
        artists,
        genre,
        album,
        year
      });

      if (picture && picture.length) {
        const { data, type } = picture[0];
        await song.putAttachment({
          id: id + "art",     // string, name of the attachment like 'cat.jpg'
          data,   // (string|Blob|Buffer) data of the attachment
          type    // (string) type of the attachment-data like 'image/jpeg'
        });
      }
      await song.putAttachment({
        id: id + "song",
        data: file,
        type: file.type
      });
    };
    acceptedFiles.forEach((file: File) => handleFile(file));
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ onDrop });

  return (
    <div className="container">
      <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </Container>
    </div>
  );
};
