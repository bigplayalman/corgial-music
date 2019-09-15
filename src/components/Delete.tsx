import React from "react";
import Database from "../Database";

const Delete = () => {

  const deleteFiles = async () => {
    // const attachments = await Database.db.attachments.find().exec();
    // console.log('attachments', attachments);
    await Database.music.find().remove();
    await Database.meta.find().remove();
    await Database.playlists.find().where("id").ne("latest").remove();
    await Database.latestPlaylist.atomicSet("songs", undefined);
  };

  return (
    <button onClick={() => deleteFiles()}>
      Delete
    </button>
  );
};

export default Delete;
