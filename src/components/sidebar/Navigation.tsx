import React from "react";
import { Menu, Pane } from "evergreen-ui";
import { A } from "hookrouter";
import "./navigation.scss";

export const Navigation: React.FC = () => {
  return (
    <Pane background="tint2" boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)" position="relative" zIndex={16}>
      <Menu>
        <Menu.Group>
          <A href="/" className="nav-link">
            <Menu.Item icon="music">Library</Menu.Item>
          </A>
          <A href="/upload" className="nav-link">
            <Menu.Item icon="upload">Upload</Menu.Item>
          </A>
        </Menu.Group>
      </Menu>
    </Pane>
  );
};
