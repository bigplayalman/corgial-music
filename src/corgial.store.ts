import RxDB, { RxDatabase, RxCollection } from "rxdb";
import PouchAdapterMemory from "pouchdb-adapter-memory";
import PouchAdapterHttp from "pouchdb-adapter-http";
import { Subject, Subscription, from, BehaviorSubject } from "rxjs";
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

        default: break;
      }
    });
  }

  async createCollections() {
    await this.db.collection({ name: "songs", schema: songSchema });
    await this.db.collection({ name: "playlists", schema: playlistSchema });
    this.events.next({ type: "DB_COLLECTIONS_CREATED", payload: true });
  }
}
