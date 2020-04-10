import React, { useState, useContext } from "react";
import EditorJs from "react-editor-js";
import { Modal, Button, Grid, Divider } from "semantic-ui-react";
import {
  TextField,
  Backdrop,
  CircularProgress,
  Card,
  AppBar,
  Toolbar,
  createMuiTheme,
  ThemeProvider,
  IconButton,
  makeStyles,
  Container,
  Paper,
  Snackbar,
  Tooltip
} from "@material-ui/core";
import { DocumentContext } from "../../models/DocumentContext";
import Titlebar from "./components/Titlebar";
import ToolsBar from "./components/ToolsBar";
import DescriptionIcon from "@material-ui/icons/Description";
import BodyEditor from "./components/BodyEditor";
import "../../../document.css";
import { NavLink } from "react-router-dom";
import MenuBar from "./components/MenuBar";

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#ffffff"
    },
    primary: {
      main: "#00b2ff"
    }
  }
});

const useStyles = makeStyles(theme => ({
  appbar: {
    height: "90px"
  },
  container: {
    paddingTop: "95px",
    height: "100%"
  },
  row: {
    paddingTop: 0,
    paddingBottom: 0
  },
  largeIcon: {
    width: 40,
    height: 40
  }
}));

export default function DocumentEditor() {
  const { currentDocument, isLoading, errorMsg } = useContext(DocumentContext);
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar elevation={0} className={classes.appbar} color="secondary">
          <Toolbar>
            <Tooltip title="Back">
              <NavLink to={`/home/${currentDocument?.parent ?? ""}`}>
                <DescriptionIcon
                  className={classes.largeIcon}
                  fontSize="large"
                  color="primary"
                />
              </NavLink>
            </Tooltip>
            <Grid style={{ marginLeft: 10 }}>
              <Grid.Row style={{ padding: 0 }}>
                <Titlebar />
              </Grid.Row>
              <Grid.Row style={{ paddingTop: 0, paddingBottom: 0 }}>
                <MenuBar />
              </Grid.Row>
              <Grid.Row style={{ padding: 0 }}>
                {currentDocument && <ToolsBar />}
              </Grid.Row>
            </Grid>
          </Toolbar>
        </AppBar>
        <Container id="container" className={classes.container}>
          {currentDocument && (
            <Paper
              style={{ height: "100%", minHeight: window.innerHeight - 95 }}
              square
            >
              <BodyEditor />
            </Paper>
          )}
        </Container>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={errorMsg !== undefined}
          message={errorMsg}
        />
        <Backdrop
          open={isLoading && currentDocument === undefined}
          style={{
            zIndex: 1,
            color: "#fff"
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </ThemeProvider>
  );
}
