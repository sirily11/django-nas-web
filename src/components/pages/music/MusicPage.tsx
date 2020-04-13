import React, { useContext, useState } from "react";
import UpdateIcon from "@material-ui/icons/Update";
import { Container, Segment, Progress, Menu } from "semantic-ui-react";
import { HomePageContext } from "../../models/HomeContext";
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
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
  Tooltip
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

const theme = createMuiTheme({
  palette: {
    primary: orange
  }
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff"
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
    }
  })
);

export default function MusicPage() {
  const { isLoading, errorMsg, updateMetadata, filterField } = React.useContext(
    MusicContext
  );
  const [show, setShow] = useState(false);
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div>
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
        </AppBar>
        <Backdrop className={classes.backdrop} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Hidden xsDown implementation="js">
          <Container
            style={{
              paddingTop: 20,
              overflow: "hidden",
              height: "100%",
              paddingLeft: 40,
              paddingRight: 40
            }}
          >
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
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={errorMsg !== undefined}
          message={`${errorMsg}`}
        />
      </div>
    </ThemeProvider>
  );
}
