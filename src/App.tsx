import React, { useState, useEffect } from "react";
import { Pane, Spinner } from "evergreen-ui";
import CorgialStore from "./corgial.store";
import { CorgialProvider } from "./Corgial.Context";
import { useRoutes, useRedirect } from "hookrouter";
import { routes } from "./router/routes";
import { Navigation } from "./components/sidebar/Navigation";
import "./styles.scss";
import { Player } from "./components/player/Player";
import { NotFound } from "./router/NotFound";

const App: React.FC<{}> = () => {

  const [store, setStore] = useState<CorgialStore>();
  const routeResult = useRoutes(routes);
  useRedirect("/", "/library");

  useEffect(() => {
    const corgial = new CorgialStore();
    const sub = corgial.getStore("status").subscribe((event) => {
      if (event.status === "ready") {
        setStore(corgial);
      }
    });

    corgial.initialize();
    return () => {
      sub.unsubscribe();
    };
  }, []);

  if (!store) {
    return <Spinner />;
  }

  return (
    <CorgialProvider value={store}>
      <Pane background="tint2" display="grid" gridTemplateRows="1fr 80px" height="100%">
        <Pane display="grid" gridTemplateColumns="200px 1fr">
          <Navigation />
          {routeResult || <NotFound />}
        </Pane>
        <Player />
      </Pane>
    </CorgialProvider>
  );
};

export default App;
