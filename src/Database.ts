import RxDB, { RxDatabase, RxCollection } from "rxdb";
import PouchAdapterMemory from "pouchdb-adapter-memory";
import PouchAdapterHttp from "pouchdb-adapter-http";
import { song, playlist } from "./rxdb/schemas";
import { SongProps } from "./rxdb/schemas/song.schema";
import { PlaylistProps } from "./rxdb/schemas/playlist.schema";

RxDB.plugin(PouchAdapterMemory);
RxDB.plugin(PouchAdapterHttp);

export interface DatabaseCollections {
  songs: RxCollection<SongProps>;
  playlists: RxCollection<PlaylistProps>;
}

let dbPromise: Promise<RxDatabase<DatabaseCollections>>;

const collections = [
  {
    name: "songs",
    schema: song
  },
  {
    name: "playlists",
    schema: playlist
  }
];

const _create = async () => {
  const db = await RxDB.create<DatabaseCollections>({
    name: "corgial",
    adapter: "memory",
    multiInstance: false,
    queryChangeDetection: true
  });
  console.log("created db", db);
  await Promise.all(collections.map((collection) => db.collection(collection)));
  await db.playlists.insertLocal("current", {});
  await db.songs.insertLocal("current", {});
  await db.songs.insertLocal("queue", {});
  return db;
};

export const get = () => {
  if (!dbPromise)
    dbPromise = _create();
  return dbPromise;
};
