import RxDB, { RxDatabase, RxCollection } from "rxdb";
import PouchAdapterMemory from "pouchdb-adapter-memory";
import PouchAdapterHttp from "pouchdb-adapter-http";
import { Subject, Subscription, from, BehaviorSubject } from "rxjs";
import { first } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import * as mm from "music-metadata-browser";
import { v4 } from "uuid";
import { IPicture } from "music-metadata/lib/type";

import { SongProps, songSchema } from "./rxdb/schemas/song.schema";
import { PlaylistProps, playlistSchema } from "./rxdb/schemas/playlist.schema";

RxDB.plugin(PouchAdapterMemory);
RxDB.plugin(PouchAdapterHttp);

export interface DatabaseCollections {
  songs: RxCollection<SongProps>;
  playlists: RxCollection<PlaylistProps>;
}

export interface CorgialEvent {
  type: string;
  payload: any;
}

export default class CorgialStore {
  db!: RxDatabase<DatabaseCollections>;
  events: Subject<CorgialEvent>;
  status!: BehaviorSubject<string>;
  sub!: Subscription;
  dbSub!: Subscription;
  constructor() {
    this.status = new BehaviorSubject("initialized");
    this.events = new Subject<CorgialEvent>();
    this.reducer();
    this.initialize();
  }

  initialize() {
    this.dbSub = from(RxDB.create<DatabaseCollections>({
      name: "corgial",
      adapter: "memory",
      multiInstance: false,
      queryChangeDetection: true
    })).subscribe((db) => {
      this.events.next({ type: "DB_CREATED", payload: db });
    });
  }

  reducer() {
    this.sub = this.events.subscribe((event) => {
      switch (event.type) {
        case "DB_CREATED": {
          this.db = event.payload;
          this.createCollections();
          break;
        }
        case "DB_COLLECTIONS_CREATED": {
          this.status.next("ready");
          break;
        }
        case "FILE_UPLOADED": {
          console.log("file", event.payload);
          break;
        }
        case "FILE_FAILED": {
          console.log("failed", event.payload);
          break;
        }
        default: break;
      }
    });
  }

  async createCollections() {
    await this.db.collection({ name: "songs", schema: songSchema });
    await this.db.collection({ name: "playlists", schema: playlistSchema });
    this.events.next({ type: "DB_COLLECTIONS_CREATED", payload: true });
  }

  async saveDetails(file: File) {
    const metadata = await mm.parseBlob(file);
    const id = v4();
    let title = metadata.common.title;
    const { artists, genre, album, picture } = metadata.common;
    let pictureUrl: string = "";
    if (!title) {
      title = file.name;
    }
    if (picture && picture.length) {
      pictureUrl = await this.savePicture(id, picture[0]);
    }

    const payload: SongProps = {
      id,
      title,
      genre,
      album,
      artists,
      tags: ["new"],
      favorite: false,
      skipped: 0,
      played: 0,
      filename: file.name,
      picture: pictureUrl,
      playlists: []
    };
    await this.db.songs.atomicUpsert(payload);
    this.events.next({ type: "FILES_PROGRESS", payload: "add" });
  }

  async savePicture(id: string, picture: IPicture) {
    const name = `${id}.${picture.format.split("/")[1]}`;
    const blob = new Blob([picture.data], { type: picture.format });
    const url = URL.createObjectURL(blob);
    console.log(name, url);
    return name;
  }

  uploadFiles(files: File[]) {
    this.events.next({ type: "FILES_PROGRESS", payload: "reset" });
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file, file.name);
      const request$ = ajax({
        method: "POST",
        url: "http://localhost:3300/api/upload",
        body: formData
      });
      request$.pipe(first()).subscribe((response) => {
        if (response.status === 200) {
          this.saveDetails(file);
        }
      });
    }
  }
}
