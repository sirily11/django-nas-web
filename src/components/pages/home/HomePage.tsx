import React, { useContext, useState } from "react";
import Header from "./components/others/Header";
import "semantic-ui-css/semantic.min.css";
import ListPanel from "./components/folders/ListFolderPanel";
import { Container, Segment, Progress, Grid, Menu } from "semantic-ui-react";
import NasMenus from "./components/others/NasMenu";
import ComputerStatus from "./components/others/ComputerStatus";
import ListFilesPanel from "./components/files/ListFilesPanel";
import { HomePageContext } from "../../models/HomeContext";
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import MenuIcon from "@material-ui/icons/Menu";
import UploadFilesSideBar from "./components/files/UploadFilesSideBar";
import { Hidden, AppBar, Toolbar, IconButton, Drawer } from "@material-ui/core";

export function HomePage() {
  const { nas, isLoading, update } = useContext(HomePageContext);
  const [show, setShow] = useState(false);

  return (
    <div
      id="home"
      style={{
        height: "100%",
        overflow: "hidden"
      }}
    >
      {/** drawer */}
      <Drawer open={show} onClose={() => setShow(false)}>
        <div style={{ width: 300, height: "100%" }}>
          <ListPanel />
        </div>
      </Drawer>
      {/** end drawer */}
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
            {/** left side */}
            <Hidden smDown implementation="js">
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
            </Hidden>
            {/** end left */}
            <Grid.Column
              computer={10}
              mobile={16}
              tablet={16}
              style={{ height: "100%" }}
            >
              {/** App Bar */}
              <Hidden mdUp>
                <IconButton
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Hidden>
              {/** end App Bar */}
              <ContextMenuTrigger id="files">
                <ListFilesPanel />
              </ContextMenuTrigger>
            </Grid.Column>
            {/** right side */}
            <Hidden smDown implementation="js">
              <Grid.Column
                computer={3}
                style={{ height: "100%", backgroundColor: "#fcfcfc" }}
              >
                <UploadFilesSideBar />
              </Grid.Column>
            </Hidden>
            {/** end right side */}
          </Grid.Row>
        </Grid>
      </Segment>
      <NasMenus />
    </div>
  );
}
