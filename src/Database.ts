import RxDB, { RxDatabase, RxCollection, RxDocument } from "rxdb";
import PouchAdapterMemory from "pouchdb-adapter-memory";
import PouchAdapterHttp from "pouchdb-adapter-http";
import { song, playlist, meta } from "./rxdb/schemas";
import { MetaProps } from "./rxdb/schemas/meta.schema";
import { SongProps } from "./rxdb/schemas/song.schema";
import { PlaylistProps } from "./rxdb/schemas/playlist.schema";
import { v4 } from "uuid";

RxDB.plugin(PouchAdapterMemory);
RxDB.plugin(PouchAdapterHttp);

export default class Database {
  static db: RxDatabase;
  static music: RxCollection<RxDocument<SongProps>>;
  static playlists: RxCollection<RxDocument<PlaylistProps>>;
  static meta: RxCollection<RxDocument<MetaProps>>;
  static latestPlaylist: RxDocument<PlaylistProps>;

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

    await this.music.insertLocal("queue", {songs: []});
    await this.playlists.insertLocal("current", { playlist: "" });
    await this.music.insertLocal("current", { song: "" });

    this.music.sync({
      remote: "http://localhost:2000/music"
    });
    this.meta.sync({
      remote: "http://localhost:2000/meta"
    });
    const sync = this.playlists.sync({
      remote: "http://localhost:2000/playlists",
      options: {
        live: false
      }
    });

    sync.complete$.subscribe(async (completed) => {
      if (completed) {
        let latestPlaylist = await this.playlists.findOne().where("name").eq("Last Added").exec();
        if (!latestPlaylist) {
          const id = v4();
          latestPlaylist = this.playlists.newDocument({ id, name: "Last Added", count: 0, songs: [] });
          await latestPlaylist.save();
        }

        this.latestPlaylist = latestPlaylist;
        this.playlists.sync({remote: "http://localhost:2000/playlists"});
      }
    });
  }
}
