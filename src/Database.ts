import RxDB, { RxDatabase, RxCollection } from "rxdb";
import PouchAdapterMemory from "pouchdb-adapter-memory";
import PouchAdapterHttp from "pouchdb-adapter-http";
import { Schema } from "./Schema";

RxDB.plugin(PouchAdapterMemory);
RxDB.plugin(PouchAdapterHttp);

export default class Database {
  static db: RxDatabase;
  static music: RxCollection;

  static async init() {
    this.db = await RxDB.create({
      name: "corgialmusic",
      adapter: "memory",
      multiInstance: false,
      queryChangeDetection: false
    });
    this.music = await this.db.collection({
      name: "music",
      schema: Schema
    });
    this.music.sync({
      remote: "http://localhost:2000/corgialmusic"
    });
  }
}
