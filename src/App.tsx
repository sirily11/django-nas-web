import React, { Component, useState } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Route,
  Link,
  NavLink,
  Redirect
} from "react-router-dom";
import { HomePage } from "./components/pages/home/HomePage";
import { HomePageProvider } from "./components/models/HomeContext";
import { SystemProvider } from "./components/models/SystemContext";
import SystemInfoPage from "./components/pages/systemInfo/SystemInfoPage";
import { Sidebar, Menu, Icon, Button } from "semantic-ui-react";
import MenuIcon from "@material-ui/icons/Menu";
import { IconButton } from "@material-ui/core";

export default function App() {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <SystemProvider>
      <Router>
        <Sidebar.Pushable style={{ margin: 0 }}>
          <Sidebar
            style={{ boxShadow: "none", border: "none" }}
            as={Menu}
            animation="push"
            icon="labeled"
            onHide={() => setVisible(false)}
            vertical
            visible={visible}
            width="thin"
          >
            <Menu.Item as="a" href="#/home">
              <Icon name="home" />
              Home
            </Menu.Item>
            <Menu.Item as="a" href="#/info">
              <Icon name="info" />
              System Info
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            {showMenu && (
              <IconButton
                onClick={() => setVisible(!visible)}
                style={{ position: "absolute" }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <div style={{ height: "100%" }}>
              <Route exact path="/" component={() => <Redirect to="/home" />} />
              <Route
                exact
                path="/home/:id?"
                component={(props: any) => {
                  setShowMenu(true);
                  return (
                    <HomePageProvider {...props}>
                      <HomePage></HomePage>
                    </HomePageProvider>
                  );
                }}
              />

              <Route
                exact
                path="/info"
                component={(props: any) => {
                  setShowMenu(true);
                  return <SystemInfoPage />;
                }}
              />
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Router>
    </SystemProvider>
  );
}
