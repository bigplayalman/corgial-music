import React, { Component } from "react";
import * as mm from "music-metadata-browser";
import { v4 } from "uuid";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { Subscription } from "rxjs";
import { IPicture } from "music-metadata/lib/type";
import * as uppyAudio from "./uppy/uppy.audio";
import * as uppyImage from "./uppy/uppy.image";

export class FileUpload extends Component {
  audio!: Uppy.Uppy;
  image!: Uppy.Uppy;
  insertSong!: Subscription;
  constructor(props: any) {
    super(props);
    this.audio = uppyAudio.get();
    this.image = uppyImage.get();
  }

  componentDidMount() {
    this.subDB();
    this.subUppy();
  }

  componentWillUnmount() {
    this.audio.off("complete", () => {});
    this.audio.off("upload-success", () => { });
    this.insertSong.unsubscribe();
  }

  subUppy() {
    this.audio.on("upload-success", async (file, _response) => {
      await this.saveSong(file.data, file.name);
    });
    this.audio.on("upload", () => {
      console.log("upload started");
    });
    this.audio.on("complete", (_result) => {
      console.log("jobs done");
    });
  }

  async saveSong(file: File | Blob, name: string) {
    const metadata = await mm.parseBlob(file);
    const id = v4();
    let title = metadata.common.title;
    const { artists, genre, album, picture } = metadata.common;
    console.log(metadata.common);
    if (!title) {
      title = name;
    }
    // const song = await db.songs.atomicUpsert({
    //   id, title, artists, genre, album, tags: [],
    //   favorite: false, skipped: 0, played: 0, playlists: ["all"],
    //   filename: name
    // });
    if (picture && picture.length) {
      const pictureName = await this.savePicture(picture[0], name);
      const pictureUrl = await fetch(`${process.env.REACT_APP_API}/download?filename=${pictureName}`, {
        method: "GET"
      }).then((res) => {
        return res.text();
      });
      // await song.atomicSet("picture", pictureUrl);
      console.log(pictureUrl);
    }
  }

  async savePicture(picture: IPicture, title: string) {
    const name = `${title.split(".")[0]}.${picture.format.split("/")[1]}`;
    const data = new Blob([picture.data], { type: picture.format });
    this.image.addFile({
      name, // file name
      type: picture.format, // file type
      data, // file blob
      source: "Local", // optional, determines the source of the file, for example, Instagram
      isRemote: false,
      meta: { image: true }
    });
    await this.image.upload();
    return name;
  }

  async subDB() {

    // let playlist = await db.playlists.findOne("all").exec();
    // if (!playlist) {
    //   playlist = await db.playlists.insert({ id: "all", name: "All", count: 0, songs: [] });
    // }

    // this.insertSong = db.songs.insert$.subscribe(async (event) => {
    //   if (playlist) {
    //     const songs = playlist.songs;
    //     songs.push(event.data.doc);
    //     await playlist.atomicUpdate((data) => {
    //       data.songs = songs;
    //       data.count = songs.length;
    //       return data;
    //     });
    //   }
    // });
  }

  render() {
    return (
      <div className="container">
        <Dashboard
          uppy={this.audio}
          showLinkToFileUploadResult={false}
        />
      </div>
    );
  }
}
