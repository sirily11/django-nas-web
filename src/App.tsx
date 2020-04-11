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
import { DocumentProvider } from "./components/models/DocumentContext";
import DocumentEditor from "./components/pages/document/DocumentEditor";
import { MovingProvider } from "./components/models/MovingContext";

export default function App() {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <SystemProvider>
      <Router>
        <div style={{ height: "100%" }}>
          <Route exact path="/" component={() => <Redirect to="/home" />} />
          <Route
            exact
            path="/home/:id?"
            component={(props: any) => {
              setShowMenu(true);
              return (
                <MovingProvider>
                  <HomePageProvider {...props}>
                    <HomePage></HomePage>
                  </HomePageProvider>
                </MovingProvider>
              );
            }}
          />
          <Route
            exact
            path="/document/:id"
            component={(props: any) => {
              setShowMenu(true);
              return (
                <MovingProvider>
                  <DocumentProvider {...props}>
                    <DocumentEditor />
                  </DocumentProvider>
                </MovingProvider>
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
      </Router>
    </SystemProvider>
  );
}
