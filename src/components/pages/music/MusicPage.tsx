/** @format */

import React, { useContext, useState } from "react";
import UpdateIcon from "@material-ui/icons/Update";
import { Container, Segment, Progress, Menu, TabPane } from "semantic-ui-react";
import { HomePageContext } from "../../models/HomeContext";

import {
  Grid,
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
  Backdrop,
  CircularProgress,
  Snackbar,
  Paper,
  Tooltip,
  Tabs,
  Tab,
  Slide,
  Fade,
  Collapse,
} from "@material-ui/core";
import orange from "@material-ui/core/colors/orange";
import CurrentPlayingPage from "./components/left/CurrentPlayingPage";
import MusicList from "./components/right/MusicList";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { NavLink } from "react-router-dom";
import { MusicContext } from "../../models/MusicContext";
import MusicSearchField from "./components/SearchField";
import MusicListMobile from "./components/mobile/MusicListMobile";
import CurrentPlayingMobile from "./components/mobile/CurrentPlayingMobile";
import ClearIcon from "@material-ui/icons/Clear";
import PlayerPage from "./components/player/PlayerPage";
import AlbumPage from "./components/album/AlbumPage";
import ArtistPage from "./components/artist/ArtistPage";

const theme = createMuiTheme({
  palette: {
    primary: orange,
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root1: {
      paddingTop: 80,
    },
    root: {
      paddingTop: 120,
      height: "100%",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
  })
);

export default function MusicPage() {
  const {
    isLoading,
    errorMsg,
    updateMetadata,
    filterField,
    currentTabIndex,
    setTabIndex,
  } = React.useContext(MusicContext);
  const [show, setShow] = useState(false);
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div style={{ maxHeight: "100%" }}>
        {/** App Bar */}
        <AppBar>
          <Toolbar>
            <NavLink to="/">
              <IconButton>
                <ArrowBackIosIcon />
              </IconButton>
            </NavLink>
            <Typography className={classes.title} variant="h6" noWrap>
              {filterField ?? "Music"}
              {filterField && (
                <Tooltip title="Clear field">
                  <NavLink to="/music">
                    <IconButton>
                      <ClearIcon />
                    </IconButton>
                  </NavLink>
                </Tooltip>
              )}
            </Typography>

            <Tooltip title="Update metadata">
              <IconButton
                onClick={async () => {
                  await updateMetadata();
                }}
              >
                <UpdateIcon />
              </IconButton>
            </Tooltip>
            <MusicSearchField />
          </Toolbar>
          <Tabs
            value={currentTabIndex}
            variant="scrollable"
            onChange={async (e, v) => {
              await setTabIndex(v);
            }}
            aria-label="simple tabs example"
          >
            <Tab label="Music" value={0} />
            <Tab label="Album" value={1} />
            <Tab label="Artist" value={2} />
            <Tab label="Playlist" value={3} />
          </Tabs>
        </AppBar>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Collapse in={currentTabIndex === 0} mountOnEnter unmountOnExit>
          <div
            className={classes.root1}
            style={{
              overflow: "hidden",
            }}
          >
            <PlayerPage />
          </div>
        </Collapse>
        <Collapse in={currentTabIndex === 1} mountOnEnter unmountOnExit>
          <div className={classes.root}>
            <AlbumPage />
          </div>
        </Collapse>
        <Collapse in={currentTabIndex === 2} mountOnEnter unmountOnExit>
          <div className={classes.root}>
            <ArtistPage />
          </div>
        </Collapse>
        <Collapse in={currentTabIndex === 3} mountOnEnter unmountOnExit>
          <div
            className={classes.root1}
            style={{
              overflow: "hidden",
            }}
          >
            <PlayerPage />
          </div>
        </Collapse>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={errorMsg !== undefined}
          message={`${errorMsg}`}
        />
      </div>
    </ThemeProvider>
  );
}
