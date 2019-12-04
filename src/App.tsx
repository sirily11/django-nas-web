import React, { Component, useState } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Route,
  Link,
  NavLink,
  Redirect
} from "react-router-dom";
import {
  spring,
  AnimatedRoute,
  AnimatedSwitch
} from "./components/plugins/react-router-transition";
import { HomePage } from "./components/pages/home/HomePage";
import { HomePageProvider } from "./components/models/HomeContext";
import { SystemProvider } from "./components/models/SystemContext";
import SystemInfoPage from "./components/pages/systemInfo/SystemInfoPage";
import { Sidebar, Menu, Icon, Button } from "semantic-ui-react";
import MenuIcon from "@material-ui/icons/Menu";
import { IconButton } from "@material-ui/core";

export default function App() {
  const [visible, setVisible] = useState(false);

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
            <Menu.Item as="a" name="Home" href="#/home" />
            <Menu.Item as="a" name="System Info" href="#/info" />
          </Sidebar>
          <Sidebar.Pusher>
            <IconButton onClick={() => setVisible(!visible)}>
              <MenuIcon />
            </IconButton>
            <AnimatedSwitch
              atEnter={{ opacity: 0 }}
              atLeave={{ opacity: 0 }}
              atActive={{ opacity: 1 }}
              className="switch-wrapper"
            >
              <Route exact path="/" component={() => <Redirect to="/home" />} />
              <Route
                exact
                path="/home/:id?"
                component={(props: any) => (
                  <HomePageProvider {...props}>
                    <HomePage></HomePage>
                  </HomePageProvider>
                )}
              />
              <Route
                exact
                path="/info"
                component={(props: any) => <SystemInfoPage />}
              />
            </AnimatedSwitch>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Router>
    </SystemProvider>
  );
}
