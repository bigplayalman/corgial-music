import RxDB, {
  RxDatabase,
  RxCollection,
  RxChangeEventInsert,
  RxChangeEventUpdate,
  RxChangeEventRemove
} from "rxdb";
import PouchAdapterMemory from "pouchdb-adapter-memory";
import PouchAdapterHttp from "pouchdb-adapter-http";
import PouchAdapterIdb from "pouchdb-adapter-idb";
import { Subject, Subscription, from, BehaviorSubject } from "rxjs";
import { cloneDeep } from "lodash";
import { first, pluck, distinctUntilChanged, mergeMap, map, filter } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import * as mm from "music-metadata-browser";
import { SongProps, songSchema } from "./rxdb/schemas/song.schema";
import { PlaylistProps, playlistSchema } from "./rxdb/schemas/playlist.schema";
import { actions } from "./actions";
import { CorgialAudio } from "./corgial.audio";

RxDB.plugin(PouchAdapterMemory);
RxDB.plugin(PouchAdapterIdb);
RxDB.plugin(PouchAdapterHttp);

export interface DatabaseCollections {
  songs: RxCollection<SongProps>;
  playlists: RxCollection<PlaylistProps>;
}

export interface CorgialState {
  status: string;
  filename?: string;
  playlist?: PlaylistProps;
  queue?: SongProps[];
  track?: SongProps;
  changes?: RxChangeEventInsert<SongProps> | RxChangeEventUpdate<SongProps> | RxChangeEventRemove<SongProps>;
}

export interface CorgialEvent {
  type: string;
  payload?: any;
}

export default class CorgialStore {
  db!: RxDatabase<DatabaseCollections>;
  events = new Subject<CorgialEvent>();
  state = new BehaviorSubject<CorgialState>({ status: "initialized" });
  music = new CorgialAudio();
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
          this.trackChanges();
          break;
        }
        case actions.QUEUE_SET: {
          state.queue = event.payload;
          break;
        }
        case actions.FILENAME_SET: {
          state.filename = event.payload;
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
        case actions.PLAYLIST_SET: {
          state.playlist = event.payload;
          break;
        }
        case actions.TRACK_SET: {
          state.track = event.payload;
          break;
        }
        case actions.TRACK_ADD: {
          state.changes = event.payload;
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
    return from(observables).pipe(
      mergeMap((value) => value),
      distinctUntilChanged((a, b) => {
        const result = JSON.stringify(a) === JSON.stringify(b);
        return result;
      })
    );
  }

  toObservable(value: string) {
    return this.state.pipe(
      pluck<CorgialState, any>(value),
      map((property) => {
        return ({ [value]: property });
      }),
      filter((mappedValue) => {
        const exists = Object.keys(mappedValue)[0];
        return typeof mappedValue[exists] !== "undefined";
      }),
      distinctUntilChanged((a, b) => {
        const result = JSON.stringify(a) === JSON.stringify(b);
        return result;
      })
    );
  }

  trackChanges() {
    const sub = from(this.db.songs.$).subscribe((changes) => {
      this.events.next({ type: actions.TRACK_ADD, payload: changes });
    });
    this.subs.push(sub);
  }

  async getTrack(track: SongProps) {
    const response = await fetch(`http://localhost:3300/api/download?filename=${track.filename}`);
    const url = await response.text();
    this.events.next({ type: actions.FILENAME_SET, payload: url });
    this.events.next({ type: actions.TRACK_SET, payload: track });
  }

  async createCollections() {
    await this.db.collection({ name: "songs", schema: songSchema });
    await this.db.collection({ name: "playlists", schema: playlistSchema });
    this.events.next({ type: actions.DB_SETUP, payload: true });
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
    // const blob = new Blob([picture.data], { type: picture.format });
    // const url = URL.createObjectURL(blob);
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
