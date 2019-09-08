import React, { useCallback, useState } from "react";
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

export const FileUpload = (_props?: any) => {

  /**
   * @param blob Blob (e.g. Web API File)
   */
  const readFromBlob = (blob: Blob) => {
    return mm.parseBlob(blob);
  };

  const [dtitle, setDtitle] =  useState();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const handleFile = async (file: File) => {
      const metadata = await readFromBlob(file);
      const id = v4();
      let title = metadata.common.title;
      const { artists, genre, album, year, picture } = metadata.common;

      if (!title) {
        title = file.name;
      }
      setDtitle(title);
      const song = await Database.music.upsert({ id, title, artists, genre, album, year });
      if (picture && picture.length) {
        const { data, type } = picture[0];
        await song.putAttachment({ id: id + "art", data, type: type || "" });
      }

      await song.putAttachment({
        id: id + "song",
        data: file,
        type: file.type
      });
      const playlist = Database.latestPlaylist.toJSON();
      playlist.songs.push(id);
      delete playlist._rev;
      await Database.meta.upsert({ id, song: id, skipped: 0, played: 0 });
      await Database.playlists.upsert(playlist);
    };
    for (const file of acceptedFiles) {
      await handleFile(file);
    }
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
      {dtitle}
    </div>
  );
};
