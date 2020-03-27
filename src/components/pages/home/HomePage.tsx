import React, { useContext } from "react";
import Header from "./components/others/Header";
import "semantic-ui-css/semantic.min.css";
import ListPanel from "./components/folders/ListFolderPanel";
import { Container, Segment, Progress, Grid, Menu } from "semantic-ui-react";
import NasMenus from "./components/others/NasMenu";
import ComputerStatus from "./components/others/ComputerStatus";
import ListFilesPanel from "./components/files/ListFilesPanel";
import { HomePageContext } from "../../models/HomeContext";
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import MenuItem from "@material-ui/core/MenuItem";
import UploadFilesSideBar from "./components/files/UploadFilesSideBar";

export function HomePage() {
  const { nas, isLoading, update } = useContext(HomePageContext);
  return (
    <div
      id="home"
      style={{
        height: "100%",
        overflow: "hidden"
      }}
    >
      <Segment
        loading={isLoading}
        style={{
          height: "100%"
        }}
      >
        <Grid
          style={{
            height: "100%",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <Grid.Row style={{ height: "100%", paddingTop: 0, paddingBottom: 0 }}>
            <Grid.Column
              computer={3}
              style={{ height: "100%", backgroundColor: "#fcfcfc" }}
            >
              <ContextMenuTrigger id="folder">
                <Grid.Row style={{ height: "93%" }}>
                  <ListPanel />
                </Grid.Row>
                <Grid.Row>
                  <ComputerStatus />
                </Grid.Row>
              </ContextMenuTrigger>
            </Grid.Column>
            <Grid.Column computer={10} mobile={16} style={{ height: "100%" }}>
              <ContextMenuTrigger id="files">
                <ListFilesPanel />
              </ContextMenuTrigger>
            </Grid.Column>
            <Grid.Column
              computer={3}
              style={{ height: "100%", backgroundColor: "#fcfcfc" }}
            >
              <UploadFilesSideBar />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <NasMenus />
    </div>
  );
}
