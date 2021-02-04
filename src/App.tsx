/** @format */

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
import {
  IconButton,
  createMuiTheme,
  ThemeProvider,
  CssBaseline,
} from "@material-ui/core";
import { DocumentProvider } from "./components/models/DocumentContext";
import DocumentEditor from "./components/pages/document/DocumentEditor";
import { MovingProvider } from "./components/models/MovingContext";
import { MusicProvider } from "./components/models/MusicContext";
import MusicPage from "./components/pages/music/MusicPage";
import BookPage from "./components/pages/book/BookPage";
import { BookContext, BookProvider } from "./components/models/BookContext";
import { FileActionProvider } from "./components/models/FileActionContext";
import { GalleryProvider } from "./components/models/GalleryContext";
import GalleryPage from "./components/pages/gallery/GalleryPage";
import { MusicFilePlugin } from "./components/models/Plugins/file plugins/plugins/MusicFilePlugin";
import { ImageFilePlugin } from "./components/models/Plugins/file plugins/plugins/ImageFilePlugin";
import { PDFFIlePlugin } from "./components/models/Plugins/file plugins/plugins/PDFFilePlugin";
import { VideoFilePlugin } from "./components/models/Plugins/file plugins/plugins/VideoFilePlugin";
import { JSONFilePlugin } from "./components/models/Plugins/file plugins/plugins/jsonFilePlugin/JSONFilePlugin";
import { CodeFilePlugin } from "./components/models/Plugins/file plugins/plugins/codeFilePlugin/CodeFilePlugin";
import { PoFilePlugin } from "./components/models/Plugins/file plugins/plugins/poFilePlugin/PoFilePlugin";
import PluginPage from "./components/pages/plugin_page/PluginPage";
import { BaseFilePlugin } from "./components/models/Plugins/file plugins/BaseFilePlugin";
import { CsvFilePlugin } from "./components/models/Plugins/file plugins/plugins/csvFilePlugin/CsvFilePlugin";
import { JupyterPlugin } from "./components/models/Plugins/file plugins/plugins/jupyterPlugin/JupyterPlugin";
import { ContextMenuProvider } from "./components/models/contextMenu/ContextMenuContext";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#fafafa",
    },
  },
});

const plugins = [
  new MusicFilePlugin(),
  new ImageFilePlugin(),
  new PDFFIlePlugin(),
  new VideoFilePlugin(),
  new JSONFilePlugin(),
  new CodeFilePlugin(),
  new PoFilePlugin(),
  new CsvFilePlugin(),
  new JupyterPlugin(),
];

const pluginsMapping: { [key: string]: BaseFilePlugin } = {};

for (let plugin of plugins) {
  pluginsMapping[plugin.getPluginName()] = plugin;
}

export default function App() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SystemProvider>
        <Router>
          <div style={{ height: "100%" }}>
            <Route exact path="/" component={() => <Redirect to="/home" />} />
            <Route
              path={"/plugin/:pluginName/:fileId/"}
              component={(props: any) => (
                <PluginPage pluginsMapping={pluginsMapping} />
              )}
            />
            <Route
              exact
              path="/home/:id?"
              component={(props: any) => {
                return (
                  <ContextMenuProvider>
                    <FileActionProvider>
                      <MovingProvider>
                        <HomePageProvider {...props}>
                          <HomePage plugins={plugins} />
                        </HomePageProvider>
                      </MovingProvider>
                    </FileActionProvider>
                  </ContextMenuProvider>
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
              path="/gallery"
              component={(props: any) => {
                return (
                  <GalleryProvider>
                    <GalleryPage />
                  </GalleryProvider>
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
    </ThemeProvider>
  );
}
