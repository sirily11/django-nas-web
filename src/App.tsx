import React, { Component, useState } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Route,
  Link,
  NavLink,
  Redirect,
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
import { MusicProvider } from "./components/models/MusicContext";
import MusicPage from "./components/pages/music/MusicPage";
import BookPage from "./components/pages/book/BookPage";
import { BookContext, BookProvider } from "./components/models/BookContext";
import { FileActionProvider } from "./components/models/FileActionContext";

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
              return (
                <FileActionProvider>
                  <MovingProvider>
                    <HomePageProvider {...props}>
                      <HomePage></HomePage>
                    </HomePageProvider>
                  </MovingProvider>
                </FileActionProvider>
              );
            }}
          />
          <Route
            exact
            path="/document/:id"
            component={(props: any) => {
              return (
                <BookProvider>
                  <MovingProvider>
                    <DocumentProvider {...props}>
                      <DocumentEditor />
                    </DocumentProvider>
                  </MovingProvider>
                </BookProvider>
              );
            }}
          />
          <Route
            exact
            path="/book"
            component={(props: any) => {
              return (
                <MovingProvider>
                  <BookProvider>
                    <BookPage />
                  </BookProvider>
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
          <Route
            path="/music"
            component={(props: any) => {
              return (
                <MusicProvider {...props}>
                  <MusicPage />
                </MusicProvider>
              );
            }}
          />
        </div>
      </Router>
    </SystemProvider>
  );
}
