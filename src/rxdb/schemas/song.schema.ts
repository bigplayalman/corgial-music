import {RxJsonSchema} from "rxdb";

export interface SongProps {
  id: string;
  title: string | undefined;
  genre: string [] | undefined;
  album: string | undefined;
  artists: string [] | undefined;
  year: number | undefined;
}
export const song: RxJsonSchema<SongProps> = {
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
      year: {
        type: "number"
      }
    },
    attachments: {
      encrypted: false
    }
};
