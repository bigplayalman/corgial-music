import React from "react";
import { Alert, Pane } from "evergreen-ui";

export const NoItems: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Pane
      display="flex"
      justifyContent="center"
      alignItems="center"
      padding={8}
    >
      <Alert
        appearance="card"
        intent="none"
        title={message}
        width="100%"
        marginTop={32}
        marginBottom={32}
      />
    </Pane>
  );
};
