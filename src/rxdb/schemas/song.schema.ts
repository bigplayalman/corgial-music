import {RxJsonSchema} from "rxdb";

export interface SongProps {
  id: string;
  title: string | undefined;
  genre: string [] | undefined;
  album: string | undefined;
  artists: string [] | undefined;
  tags?: string [];
  favorite?: boolean;
  skipped: number;
  played: number;
  filename: string;
  picture: string;
  playlists?: string [];
}
export const songSchema: RxJsonSchema<SongProps> = {
  version: 0,
    type: "object",
    properties: {
      id: {
        type: "string",
        primary: true
      },
      title: {
        type: "string"
      },
      genre: {
        type: "array",
        uniqueItems: true,
        items: {
          type: "string"
        }
      },
      album: {
        type: "string"
      },
      artists: {
        type: "array",
        uniqueItems: true,
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
      favorite: {
        type: "boolean"
      },
      skipped: {
        type: "number",
        default: 0,
      },
      played: {
        type: "number",
        default: 0,
      },
      playlists: {
        type: "array",
        ref: "playlists",
        items: {
          type: "string"
        }
      },
      picture: {
        type: "string"
      },
      filename: {
        type: "string"
      }
    }
};
