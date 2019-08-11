import {RxJsonSchema} from "rxdb";

export const Schema: RxJsonSchema = {
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
