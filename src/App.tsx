import React, { useState, useEffect } from "react";
import { Spinner } from "evergreen-ui";
import CorgialStore from "./corgial.store";
import { CorgialProvider } from "./Corgial.Context";
import { useRoutes, useRedirect } from "hookrouter";
import { routes } from "./router/routes";
import { Navigation } from "./components/navigation/Navigation";
import "./styles.scss";
import { Player } from "./components/player/Player";
import { NotFound } from "./router/NotFound";

const App: React.FC<{}> = () => {
  const [store, setStore] = useState<CorgialStore>();
  const routeResult = useRoutes(routes);
  useRedirect("/", "/library");

  useEffect(() => {
    const corgial = new CorgialStore();
    const sub = corgial.getStore("status").subscribe(event => {
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
      <div className="grid-container">
        <div className="content">
          {routeResult || <NotFound />}
        </div>
        <div className="menu">
          <Navigation />
        </div>
        <div className="player">
          <Player />
        </div>
      </div>
    </CorgialProvider>
  );
};

export default App;
