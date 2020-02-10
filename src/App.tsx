import React, { useState, useEffect } from "react";
import { Pane, Spinner } from "evergreen-ui";
import CorgialStore from "./corgial.store";
import { CorgialProvider } from "./Corgial.Context";
import { useRoutes } from "hookrouter";
import { routes } from "./router/routes";
import { Navigation } from "./components/sidebar/Navigation";
import "./styles.scss";
import { Player } from "./components/player/Player";

const App: React.FC<{}> = () => {

  const [store, setStore] = useState<CorgialStore>();
  const routeResult = useRoutes(routes);

  useEffect(() => {
    const corgial = new CorgialStore();
    const sub = corgial.status.subscribe((event) => {
      if (event === "ready") {
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
          {routeResult || <Pane background="overlay" />}
        </Pane>
        <Player />
      </Pane>

    </CorgialProvider>
  );
};

export default App;
