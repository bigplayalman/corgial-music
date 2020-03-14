import {RxJsonSchema} from "rxdb";

export interface PlaylistProps {
  cid?: string;
  title: string;
}

export const playlistSchema: RxJsonSchema<PlaylistProps> = {
  version: 0,
    type: "object",
    properties: {
      cid: {
        type: "string",
        primary: true
      },
      title: {
        type: "string",
        index: true
      }
    }
};
