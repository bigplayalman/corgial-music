import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import * as mm from "music-metadata-browser";
import * as Database from "./Database";
import { v4 } from "uuid";
import * as base64 from "base-64";

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const db = await Database.get();
    let playlist = await db.playlists.findOne("all").exec();
    if (!playlist) {
      playlist = await db.playlists.insert({ id: "all", name: "All", count: 0, songs: [] });
    }
    const songs = playlist.songs;
    const handleFile = async (file: File) => {
      const metadata = await readFromBlob(file);
      const id = v4();
      let title = metadata.common.title;
      const { artists, genre, album, year } = metadata.common;

      if (!title) {
        title = file.name.split(".")[0];
      }

      await db.songs.atomicUpsert({
        id, title, artists, genre, album, year, tags: [],
        favorite: false, skipped: 0, played: 0, playlists: ["all"],
        filename: file.name
      });

      // if (picture && picture.length) {
      //   const { data, type } = picture[0];
      //   await song.putAttachment({ id: id + "art", data, type: type || "" });
      // }

      const songData  = new FormData();
      songData.append("file", file);

      await fetch("http://localhost:3300/api/upload", {
        method: "POST",
        headers: new Headers({
          Authorization: `Basic ${base64.encode(`admin:admin`)}`
        }),
        body: songData
      });

      songs.push(id);
    };

    for (const file of acceptedFiles) {
      await handleFile(file);
    }
    if (playlist) {
      await playlist.atomicSet("songs", songs);
    }

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
