import React, { Component } from "react";
import * as mm from "music-metadata-browser";
import * as Database from "./Database";
import { v4 } from "uuid";
import Uppy from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import ms from "ms";
import { Dashboard } from "@uppy/react";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { Subscription } from "rxjs";

export class FileUpload extends Component {
  uppy!: Uppy.Uppy;
  insertSong!: Subscription;
  constructor(props: any) {
    super(props);
    this.uppy = Uppy({
      id: "corgial",
      autoProceed: true,
      debug: true,
      restrictions: {
        maxNumberOfFiles: 10,
        allowedFileTypes: [".mp3", ".flac"]
      }
    });
  }

  componentDidMount() {
    this.subDB();
    this.uppy = this.uppy.use(AwsS3, {
      limit: 10,
      timeout: ms("1 minute"),
      companionUrl: "http://localhost:3300"
    });
    const plugin: any = this.uppy.getPlugin("XHRUpload");
    plugin.opts.limit = 10;
    this.uppy.on("upload-success", async (file, _response) => {
      const metadata = await mm.parseBlob(file.data);
      const id = v4();
      let title = metadata.common.title;
      const { artists, genre, album } = metadata.common;

      if (!title) {
        title = file.name.split(".")[0];
      }
      const db = await Database.get();
      await db.songs.atomicUpsert({
        id, title, artists, genre, album, tags: [],
        favorite: false, skipped: 0, played: 0, playlists: ["all"],
        filename: file.name
      });
    });
    this.uppy.on("upload", () => {
      console.log("upload started");
    });
    this.uppy.on("complete", (_result) => {
      console.log("jobs done");
    });
    this.setState({ ready: true });
  }

  async subDB() {
    const db = await Database.get();
    let playlist = await db.playlists.findOne("all").exec();
    if (!playlist) {
      playlist = await db.playlists.insert({ id: "all", name: "All", count: 0, songs: [] });
    }

    this.insertSong = db.songs.insert$.subscribe(async (event) => {
      if (playlist) {
        const songs = playlist.songs;
        songs.push(event.data.doc);
        await playlist.atomicUpdate((data) => {
          data.songs = songs;
          data.count = songs.length;
          return data;
        });
      }
    });
  }

  componentWillUnmount() {
    this.uppy.off("complete", () => {
      console.log("unsubscribed");
    });
    this.uppy.off("upload-success", () => { });
    this.uppy.close();
    this.insertSong.unsubscribe();
  }

  render() {
    return (
      <div className="container">
        <Dashboard
          uppy={this.uppy}
          showLinkToFileUploadResult={false}
        />
      </div>
    );
  }
}
