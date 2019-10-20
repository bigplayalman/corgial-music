import React from "react";
import * as Database from "../Database";

const Delete = () => {

  const deleteFiles = async () => {
    const db = await Database.get();
    await db.songs.find().remove();
    await db.playlists.find().remove();
  };

  return (
    <button onClick={() => deleteFiles()}>
      Delete
    </button>
  );
};

export default Delete;
