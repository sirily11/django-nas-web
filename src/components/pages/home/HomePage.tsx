import React, { useContext, useState } from "react";
import Header from "./components/others/Header";
import "semantic-ui-css/semantic.min.css";
import ListPanel from "./components/folders/ListFolderPanel";
import { Segment, Grid, Menu } from "semantic-ui-react";
import NasMenus from "./components/others/NasMenu";
import ComputerStatus from "./components/others/ComputerStatus";
import ListFilesPanel from "./components/files/ListFilesPanel";
import { HomePageContext } from "../../models/HomeContext";
import { ContextMenuTrigger } from "react-contextmenu";
import MenuIcon from "@material-ui/icons/Menu";
import UploadFilesSideBar from "./components/files/UploadFilesSideBar";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import {
  Hidden,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  makeStyles,
  Theme,
  createStyles,
  fade,
  Typography,
  InputBase,
  createMuiTheme,
  ThemeProvider,
  Tooltip
} from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import SearchField from "./components/files/SearchField";
import { NavLink } from "react-router-dom";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#fafafa"
    }
  }
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1,
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto"
      }
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch"
        }
      }
    }
  })
);

export function HomePage() {
  const { nas, isLoading, update } = useContext(HomePageContext);
  const [show, setShow] = useState(false);
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div
        id="home"
        style={{
          height: "100%",
          overflow: "hidden"
        }}
      >
        {/** App Bar */}
        <AppBar position="static">
          <Toolbar>
            <Hidden mdUp>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                onClick={() => {
                  setShow(true);
                }}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Typography className={classes.title} variant="h6" noWrap>
              Django Nas
            </Typography>
            <Tooltip title="Open Music App">
              <NavLink to="/music">
                <IconButton>
                  <OpenInNewIcon />
                </IconButton>
              </NavLink>
            </Tooltip>
            <SearchField />
          </Toolbar>
        </AppBar>
        {/** End App Bar */}
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
            height: "100%",
            margin: 0
          }}
        >
          <Grid
            style={{
              height: "100%",
              overflow: "hidden",
              position: "relative"
            }}
          >
            <Grid.Row
              style={{ height: "100%", paddingTop: 0, paddingBottom: 0 }}
            >
              {/** left side */}
              <Hidden smDown implementation="js">
                <Grid.Column
                  computer={3}
                  style={{ height: "100%", backgroundColor: "#fcfcfc" }}
                >
                  <ContextMenuTrigger id="folder">
                    <Grid.Row style={{ height: "92%" }}>
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
                <ContextMenuTrigger id="files">
                  <ListFilesPanel />
                </ContextMenuTrigger>
              </Grid.Column>
              {/** right side */}
              <Hidden smDown implementation="js">
                <Grid.Column
                  computer={3}
                  style={{
                    height: "100%",
                    backgroundColor: "#fcfcfc"
                  }}
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
    </ThemeProvider>
  );
}
