import React, { useState, ChangeEvent, useContext, useEffect } from "react";
import { Pane, IconButton, TextInput } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";
import uuid from "uuid";
import { navigate } from "hookrouter";
import { PlaylistProps } from "../../rxdb/schemas/playlist.schema";

export interface PlayFormProps {
  cid: string;
}

export const PlaylistForm: React.FC<PlayFormProps> = ({ cid }) => {
  const [playlist, setPlaylist] = useState<PlaylistProps>({ title: "new" });
  const [dirty, setDirty] = useState(false);
  const context = useContext(CorgialContext);

  useEffect(() => {
    let ignore = false;
    const sub = context.getStore("playlist").subscribe(state => {
      for (const property in state) {
        switch (property) {
          case "playlist":
            !ignore && setPlaylist(state[property]);
            break;
        }
      }
    });

    if (cid !== "new") {
      context.fetchPlaylist(cid);
    }
    return () => {
      sub.unsubscribe();
      ignore = true;
    };
  }, [context, cid]);

  const save = async () => {
    setDirty(true);
    if (!playlist.title) {
      return;
    }
    cid === "new"
      ? await context.db.playlists.insert({
        cid: uuid.v4(),
        title: playlist.title
      })
      : await context.db.playlists.upsert({
        cid,
        title: playlist.title
      });
    navigate("/library");
  };

  return (
    <Pane
        display="flex"
        height={64}
        justifyContent="space-between"
        alignItems="center"
        padding={16}
        boxShadow="0 0px 1px rgba(0, 0, 0, 0.4)"
        marginBottom={1}
      >
        <TextInput
          required
          flex="1"
          value={playlist.title}
          placeholder="Title of the playlist..."
          isInvalid={dirty && !playlist.title.length}
          onInput={() => setDirty(true)}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPlaylist({ ...playlist, title: e.target.value })
          }
        />
        <IconButton
          paddingLeft={8}
          height={36}
          icon="floppy-disk"
          intent="success"
          appearance="minimal"
          onClick={() => save()}
        />
      </Pane>
  );
};
