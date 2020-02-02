import {RxJsonSchema} from "rxdb";

export interface PlaylistProps {
  cid: string;
  name: string;
  songs: string [];
}

export const playlistSchema: RxJsonSchema<PlaylistProps> = {
  version: 0,
    type: "object",
    properties: {
      cid: {
        type: "string",
        primary: true
      },
      name: {
        type: "string"
      },
      songs: {
        type: "array",
        ref: "songs",
        items: {
          type: "string"
        }
      }
    }
};
