import RxDB, { RxDatabase, RxCollection, RxDocument } from "rxdb";
import PouchAdapterMemory from "pouchdb-adapter-memory";
import PouchAdapterHttp from "pouchdb-adapter-http";
import PouchAdapterIdb from "pouchdb-adapter-idb";
import { Subject, Subscription, from, BehaviorSubject } from "rxjs";
import { cloneDeep } from "lodash";
import { first, pluck, distinctUntilChanged, mergeMap, map } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import * as mm from "music-metadata-browser";
import { SongProps, songSchema } from "./rxdb/schemas/song.schema";
import { PlaylistProps, playlistSchema } from "./rxdb/schemas/playlist.schema";
import { actions } from "./actions";

RxDB.plugin(PouchAdapterMemory);
RxDB.plugin(PouchAdapterIdb);
RxDB.plugin(PouchAdapterHttp);

export interface DatabaseCollections {
  songs: RxCollection<SongProps>;
  playlists: RxCollection<PlaylistProps>;
}

export interface CorgialState {
  status: string;
  queue?: SongProps[];
  playlist?: PlaylistProps;
  song?: SongProps;
}

export interface CorgialEvent {
  type: string;
  payload: any;
}

export default class CorgialStore {
  db!: RxDatabase<DatabaseCollections>;
  events = new Subject<CorgialEvent>();
  state = new BehaviorSubject<CorgialState>({ status: "initialized" });
  subs: Subscription[] = [];

  constructor() {
    this.reducer();
  }

  initialize() {
    const sub = from(RxDB.create<DatabaseCollections>({
      name: "corgial",
      adapter: "idb",
      multiInstance: false,
      queryChangeDetection: true
    })).subscribe((db) => {
      this.events.next({ type: actions.DB_CREATED, payload: db });
    });
    this.subs.push(sub);
  }

  reducer() {
    const sub = this.events.subscribe((event) => {
      const state = cloneDeep(this.state.getValue());
      switch (event.type) {
        case actions.DB_CREATED: {
          this.db = event.payload;
          this.createCollections();
          break;
        }
        case actions.DB_SETUP: {
          state.status = "ready";
          break;
        }
        case actions.SET_PLAYLIST: {
          state.playlist = event.payload;
          break;
        }
        case actions.SET_QUEUE: {
          state.queue = event.payload;
          break;
        }
        case actions.PLAY_SONG: {
          state.song = event.payload;
          break;
        }
        case actions.FILE_UPLOADED: {
          console.log("file", event.payload);
          break;
        }
        case actions.FILE_FAILED: {
          console.log("failed", event.payload);
          break;
        }
        default: break;
      }
      this.state.next(state);
    });
    this.subs.push(sub);
  }

  getStore(values: string[] | string) {
    if (typeof values === "string") {
      return this.toObservable(values);
    }
    const observables = values.map((value) => {
      return this.toObservable(value);
    });
    return from(observables).pipe(mergeMap((value) => value));
  }

  async fetchPlaylist(cid: string) {
    const playlist = await this.db.playlists.findOne({ cid }).exec();
    if (playlist)
      this.setPlaylist(playlist);
  }

  setPlaylist(playlist: { title: string } | RxDocument<PlaylistProps, {}>) {
    this.events.next({
      type: actions.SET_PLAYLIST,
      payload: playlist
    });
  }

  toObservable(value: string) {
    return this.state.pipe(
      pluck<CorgialState, string | SongProps | PlaylistProps | SongProps[]>(value),
      map((property) => {
        return ({ [value]: property });
      }),
      distinctUntilChanged((a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
      })
    );
  }

  async getSong(song: string) {
    const response = await fetch(`http://localhost:3300/api/download?filename=${song}`);
    const url = await response.text();
    this.events.next(({ type: actions.PLAY_SONG, payload: url }));
  }

  async createCollections() {
    await this.db.collection({ name: "songs", schema: songSchema });
    await this.db.collection({ name: "playlists", schema: playlistSchema });
    this.events.next({ type: actions.DB_SETUP, payload: true });
  }

  async fetchSongs(options: any = {}) {
    const songs = await this.db.songs.find(options).exec();
    this.events.next({ type: actions.SET_QUEUE, payload: songs });
  }

  async saveDetails(file: File) {
    const metadata = await mm.parseBlob(file);
    let title = metadata.common.title;
    const { artists, genre, album } = metadata.common;
    if (!title) {
      title = file.name;
    }

    const payload: SongProps = {
      cid: title + Date.now(),
      title,
      genre,
      album,
      artists,
      tags: ["new"],
      favorite: false,
      skipped: 0,
      played: 0,
      filename: file.name,
      playlists: [],
      dateAdded: Date.now()
    };
    await this.db.songs.atomicUpsert(payload);
    this.events.next({ type: actions.FILES_PROGRESS, payload: "add" });
  }

  async savePicture(id: string, picture: mm.IPicture) {
    const name = `${id}.${picture.format.split("/")[1]}`;
    const blob = new Blob([picture.data], { type: picture.format });
    const url = URL.createObjectURL(blob);
    console.log(name, url);
    return name;
  }

  uploadFiles(files: File[]) {
    this.events.next({ type: actions.FILES_PROGRESS, payload: "reset" });
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

  destroy() {
    this.subs.map((sub) => sub.unsubscribe());
  }
}
