import React, { useState, ChangeEvent, useContext, useEffect } from "react";
import { Pane, TextInputField, Heading, IconButton } from "evergreen-ui";
import CorgialContext from "../../Corgial.Context";
import uuid from "uuid";
import { navigate } from "hookrouter";

export interface PlayFormProps {
  cid: string;
}

export const PlaylistForm: React.FC<PlayFormProps> = ({ cid }) => {
  const [value, setValue] = useState("");
  const [dirty, setDirty] = useState(false);
  const context = useContext(CorgialContext);

  useEffect(() => {
    if (cid === "new") {
      context.setPlaylist({ title: "All Songs" });
    } else {
      context.fetchPlaylist(cid);
    }
    context.setQuery({});
    const sub = context.getStore("playlist").subscribe(state => {
      for (const property in state) {
        switch (property) {
          case "playlist":
            setValue(state[property].title);
            break;
        }
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, [context, cid]);

  const save = async () => {
    setDirty(true);
    if (!value) {
      return;
    }
    cid === "new"
      ? await context.db.playlists.insert({
          cid: uuid.v4(),
          title: value,
          songs: []
        })
      : await context.db.playlists.upsert({
          cid,
          title: value
        });
    navigate("/library");
  };

  return (
    <Pane
      display="grid"
      gridAutoColumns=".5fr"
      gridAutoRows={72}
      boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)"
      position="relative"
      zIndex={8}
    >
      <Pane
        gridColumn="1 / span 2"
        display="flex"
        boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)"
        justifyContent="space-between"
        alignItems="center"
        padding={16}
      >
        <Heading size={600}>
          {cid === "new" ? "New Playlist" : `${value} Playlist`}
        </Heading>
        <IconButton
          height={36}
          icon="floppy-disk"
          intent="success"
          appearance="minimal"
          onClick={() => save()}
        />
      </Pane>
      <Pane padding={8} margin={8} gridColumn="1 / span 2">
        <TextInputField
          required
          label="Title"
          width="100%"
          value={value}
          placeholder="Title of the playlist..."
          isInvalid={dirty && !value.length}
          validationMessage={
            dirty && !value.length ? "Title is required." : null
          }
          onInput={() => setDirty(true)}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
        />
      </Pane>
    </Pane>
  );
};
