import {RxJsonSchema} from "rxdb";

export interface PlaylistProps {
  id: string;
  name: string;
  count: number;
  songs: string [];
}

export const playlist: RxJsonSchema<PlaylistProps> = {
  version: 0,
    type: "object",
    properties: {
      id: {
        type: "string",
        primary: true
      },
      name: {
        type: "string"
      },
      count: {
        type: "number",
        default: 0,
      },
      songs: {
        type: "array",
        ref: "music",
        items: {
          type: "string"
        }
      }
    }
};
