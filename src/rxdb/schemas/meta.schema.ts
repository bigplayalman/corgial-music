import {RxJsonSchema} from "rxdb";

export interface MetaProps {
  id: string;
  song: string;
  tags?: string [];
  heart?: number;
  skipped: number;
  played: number;
  playlists?: string [];
}

export const meta: RxJsonSchema<MetaProps> = {
  version: 0,
    type: "object",
    properties: {
      id: {
        type: "string",
        primary: true
      },
      song: {
        ref: "music",
        type: "string"
      },
      tags: {
        type: "array",
        uniqueItems: true,
        items: {
          type: "string"
        }
      },
      heart: {
        type: "number",
        default: 100,
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
        items: {
          type: "string",
          ref: "playlist",
        }
      }
    }
};
