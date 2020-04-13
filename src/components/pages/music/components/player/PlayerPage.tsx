import React from "react";
import { Hidden, Grid } from "@material-ui/core";
import CurrentPlayingPage from "../left/CurrentPlayingPage";
import { Container } from "semantic-ui-react";
import CurrentPlayingMobile from "../mobile/CurrentPlayingMobile";
import MusicList from "../right/MusicList";
import MusicListMobile from "../mobile/MusicListMobile";

export default function PlayerPage() {
  return (
    <div>
      <Hidden xsDown implementation="js">
        <Container>
          {/** End App Bar */}
          <Grid container style={{ margin: 10 }}>
            <Grid item sm={4}>
              <CurrentPlayingPage />
            </Grid>
            <Grid item sm={8}>
              <MusicList />
            </Grid>
          </Grid>
        </Container>
      </Hidden>
      <Hidden mdUp implementation="js">
        <Container fluid>
          <MusicListMobile />
        </Container>
        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%"
          }}
        >
          <CurrentPlayingMobile />
        </div>
      </Hidden>
    </div>
  );
}
