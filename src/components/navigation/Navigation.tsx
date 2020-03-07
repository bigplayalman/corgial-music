import React from "react";
import { Pane, Icon, Heading } from "evergreen-ui";
import { A } from "hookrouter";
import "./navigation.scss";

export const Navigation: React.FC = () => {
  const menu = [
    {
      icon: "music",
      title: "Libraray",
      link: "/"
    },
    {
      icon: "upload",
      title: "Upload",
      link: "/upload"
    }
  ];

  return (
    <Pane background="tint2" display="grid" gridTemplateColumns="1fr 1fr" gridTemplateRows="1fr" paddingTop={2}>
      {
        menu.map((item) => {
          return (
            <A key={item.title} href={item.link} className="nav-link">
              <Pane
                display="flex"
                flexDirection="column"
                alignItems="center"
                padding={16}
                boxShadow="0px 0px 1px .5px rgba(0, 0, 0, 0.25)">
                <Icon icon={item.icon as any} size={32} />
                <Heading paddingTop={8} size={400}>{item.title}</Heading>
              </Pane>
            </A>
          );
        })
      }
    </Pane>
  );
};
