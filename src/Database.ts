import RxDB, { RxDatabase, RxCollection } from "rxdb";
import PouchAdapterMemory from "pouchdb-adapter-memory";
import PouchAdapterHttp from "pouchdb-adapter-http";
import { song, playlist, meta } from "./rxdb/schemas";
import { MetaProps } from "./rxdb/schemas/meta.schema";
import { SongProps } from "./rxdb/schemas/song.schema";
import { PlaylistProps } from "./rxdb/schemas/playlist.schema";

RxDB.plugin(PouchAdapterMemory);
RxDB.plugin(PouchAdapterHttp);

export default class Database {
  static db: RxDatabase;
  static music: RxCollection<SongProps>;
  static playlists: RxCollection<PlaylistProps>;
  static meta: RxCollection<MetaProps>;

  static async init() {
    this.db = await RxDB.create({
      name: "corgialmusic",
      adapter: "memory",
      multiInstance: false,
      queryChangeDetection: false
    });
    this.music = await this.db.collection({
      name: "music",
      schema: song
    });

    this.meta = await this.db.collection({
      name: "meta",
      schema: meta
    });

    this.playlists = await this.db.collection({
      name: "playlist",
      schema: playlist
    });

    await this.playlists.insertLocal("current", {playlist: ""});
    await this.music.insertLocal("current", { song: "" });
    this.music.sync({
      remote: "http://localhost:2000/music"
    });
    this.meta.sync({
      remote: "http://localhost:2000/meta"
    });
    this.playlists.sync({
      remote: "http://localhost:2000/playlists"
    });

  }
}
