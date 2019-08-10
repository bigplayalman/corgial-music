import {RxJsonSchema} from "rxdb";

export const Schema: RxJsonSchema = {
  version: 0,
    type: "object",
    properties: {
      id: {
        type: "string",
        primary: true
      },
      name: {
        type: "string",
      }
    },
    attachments: {
      encrypted: false
    }
};
