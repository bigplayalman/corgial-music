import React from "react";
import { Pane, Alert, Button } from "evergreen-ui";
import { navigate } from "hookrouter";

export const NotFound: React.FC = () => {
  return (
    <Pane padding={32}>
      <Alert intent="danger" title="Something went wrong" />
      <Button margin={16} onClick={() => navigate("/library")}>Back to Safety</Button>
    </Pane>
  );
};
