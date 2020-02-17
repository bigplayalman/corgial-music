import React, { Fragment } from "react";
import { Pane } from "evergreen-ui";
import { PlaylistList } from "../components/playlists/Playlist.list";
import { SongsList } from "../components/songs/Songs.list";
import { useRoutes, useRedirect, HookRouter } from "hookrouter";
import { PlaylistForm } from "../components/playlists/playlist.form";
import { NotFound } from "./NotFound";

const routes = {
  "/playlists": () => <PlaylistList />,
  "/playlists/:cid": ({ cid }: HookRouter.QueryParams) => (
    <PlaylistForm cid={cid} />
  )
};

export const Library: React.FC<{}> = () => {
  useRedirect("/", "/library/playlists");
  const routeResult = useRoutes(routes);
  return (
    <Fragment>
      {routeResult ? (
        <Pane display="grid" gridTemplateColumns=".5fr .5fr" gridTemplate="1fr">
          {routeResult}
          <SongsList />
        </Pane>
      ) : (
        <NotFound />
      )}
    </Fragment>
  );
};
