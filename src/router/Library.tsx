import React, { Fragment } from "react";
import { useRoutes, useRedirect, HookRouter } from "hookrouter";
import { NotFound } from "./NotFound";
import { PlaylistView } from "./Library/Playlist.view";
import { PlaylistFormView } from "./Library/Playlist.form.view";

const routes = {
  "/playlists": () => <PlaylistView />,
  "/playlists/:cid": ({ cid }: HookRouter.QueryParams) => (
    <PlaylistFormView cid={cid} />
  )
};

export const Library: React.FC<{}> = () => {
  useRedirect("/", "/library/playlists");
  const routeResult = useRoutes(routes);
  return <Fragment>{routeResult || <NotFound />}</Fragment>;
};
