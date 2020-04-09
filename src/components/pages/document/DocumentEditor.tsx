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
  Paper
} from "@material-ui/core";
import { DocumentContext } from "../../models/DocumentContext";
import Titlebar from "./components/Titlebar";
import ToolsBar from "./components/ToolsBar";
import DescriptionIcon from "@material-ui/icons/Description";
import BodyEditor from "./components/BodyEditor";
import "../../../document.css";
import { NavLink } from "react-router-dom";

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
    height: "85px"
  },
  container: {
    paddingTop: "100px",
    height: "100%"
  }
}));

export default function DocumentEditor() {
  const { currentDocument, isLoading } = useContext(DocumentContext);
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar elevation={0} className={classes.appbar} color="secondary">
          <Toolbar>
            <NavLink to={`/home/${currentDocument?.parent}`}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => {
                  window.history.back();
                }}
              >
                <DescriptionIcon fontSize="large" color="primary" />
              </IconButton>
            </NavLink>
            <Grid style={{ marginLeft: 10 }}>
              <Grid.Row style={{ padding: 0 }}>
                <Titlebar />
              </Grid.Row>
              <Grid.Row style={{ padding: 0 }}>
                {currentDocument && <ToolsBar />}
              </Grid.Row>
            </Grid>
          </Toolbar>
        </AppBar>
        <Container id="container" className={classes.container}>
          {currentDocument && (
            <Paper style={{ height: "100%" }}>
              <BodyEditor />
            </Paper>
          )}
        </Container>

        <Backdrop
          open={isLoading}
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
