import { RxJsonSchema } from "rxdb";

export interface SongProps {
  _id?: string;
  _rev?: string;
  cid: string;
  title: string | undefined;
  genre: string[] | undefined;
  album: string | undefined;
  artists: string[] | undefined;
  tags?: string[];
  favorite?: boolean;
  skipped: number;
  played: number;
  filename: string;
  picture?: string;
  playlists?: string[];
  dateAdded: number;
}
export const songSchema: RxJsonSchema<SongProps> = {
  version: 0,
  type: "object",
  properties: {
    cid: { type: "string", primary: true },
    title: { type: "string", index: true },
    album: { type: "string", index: true },
    favorite: { type: "boolean" },
    skipped: { type: "number", default: 0 },
    played: { type: "number", default: 0, index: true },
    picture: { type: "string" },
    filename: { type: "string" },
    dateAdded: { type: "number", index: true },
    playlists: {
      type: "array",
      ref: "playlists",
      items: {
        type: "string"
      }
    },
    tags: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "string"
      }
    },
    artists: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "string"
      }
    },
    genre: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "string"
      }
    }
  }
};
