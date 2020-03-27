import React, { useContext } from "react";
import Header from "./components/Header";
import "semantic-ui-css/semantic.min.css";
import ListPanel from "./components/ListFolderPanel";
import { Container, Segment, Progress, Grid } from "semantic-ui-react";
import Actions from "./components/Actions";
import ComputerStatus from "./components/ComputerStatus";
import ListFilesPanel from "./components/ListFilesPanel";
import { HomePageContext } from "../../models/HomeContext";

export function HomePage() {
  const { nas, isLoading, update } = useContext(HomePageContext);
  return (
    <div id="home">
      <Segment loading={isLoading}>
        <Grid
          style={{
            height: window.innerHeight * 1,
            overflow: "hidden",
            position: "relative"
          }}
        >
          <Grid.Row style={{ height: "100%", paddingTop: 0, paddingBottom: 0 }}>
            <Grid.Column
              computer={5}
              style={{ height: "100%", backgroundColor: "#fcfcfc" }}
            >
              <Grid.Row style={{ height: "93%" }}>
                <ListPanel />
              </Grid.Row>
              <Grid.Row>
                <ComputerStatus />
              </Grid.Row>
            </Grid.Column>
            <Grid.Column computer={11} style={{ height: "100%" }}>
              <ListFilesPanel />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
}
