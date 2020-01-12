import React from "react";
import { Library } from "./Library";
import { HookRouter } from "hookrouter";
import { Upload } from "./Upload";

export const routes: HookRouter.RouteObject = {
  "/": () => <Library />,
  "/upload": () => <Upload />,
};
