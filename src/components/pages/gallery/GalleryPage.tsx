/** @format */

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  makeStyles,
  Theme,
  createStyles,
  Backdrop,
  CircularProgress,
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Button,
} from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { GalleryContext } from "../../models/GalleryContext";
import ImageGrid from "./components/image-grid/ImageGrid";
import { NavLink } from "react-router-dom";
import Marker from "./components/image-grid/Marker";
import GoogleMapReact from "google-map-react";
import { ImageMetaData } from "../../models/interfaces/Folder";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

function gpsConverter(num: number[]) {
  if (num?.length !== 3) {
    return undefined;
  }
  return num[0] + num[1] / 60 + num[2] / 3600;
}

function getPosition(metadata: ImageMetaData) {
  if (!metadata) {
    return {
      lat: 59.95,
      lng: 30.33,
    };
  }

  return {
    lat:
      (metadata.data.gps_latitude_ref === "N" ? 1 : -1) *
      (gpsConverter(metadata.data.gps_latitude) ?? 59.95),
    lng:
      (metadata.data.gps_longitude_ref === "E" ? 1 : -1) *
      (gpsConverter(metadata.data.gps_longitude) ?? 30.33),
  };
}

export default function GalleryPage() {
  const classes = useStyles();
  const {
    fetchImages,
    refresh,
    isLoading,
    selectedImage,
    openDialog,
    onImageClick,
  } = React.useContext(GalleryContext);
  React.useEffect(() => {
    fetchImages().then(() => {});
  }, []);

  return (
    <div>
      <AppBar>
        <Toolbar>
          <NavLink to="/">
            <IconButton>
              <ArrowBackIosIcon />
            </IconButton>
          </NavLink>
          <Typography variant="h6" className={classes.title}>
            Gallery
          </Typography>
          <IconButton
            onClick={async () => {
              let confirm = window.confirm(
                "Do you want to update all image's metadata?"
              );
              if (confirm) {
                await refresh();
              }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box pt={10}>
        <ImageGrid />
      </Box>

      <Dialog open={openDialog} fullWidth>
        <DialogTitle>{selectedImage?.filename}</DialogTitle>
        <DialogContent>
          <CardMedia
            image={selectedImage?.file}
            style={{ height: 300, width: "100%" }}
          />
          <div style={{ height: 400, width: "100%", marginTop: 20 }}>
            {selectedImage?.image_metadata && (
              <GoogleMapReact
                defaultCenter={getPosition(selectedImage.image_metadata!)}
                defaultZoom={11}
                bootstrapURLKeys={{
                  key: process.env.REACT_APP_GOOGLE_API_KEY ?? "",
                }}
              >
                <Marker
                  lat={getPosition(selectedImage.image_metadata!).lat}
                  lng={getPosition(selectedImage.image_metadata!).lng}
                />
              </GoogleMapReact>
            )}
          </div>
          <List>
            {selectedImage?.image_metadata &&
              Object.entries(selectedImage.image_metadata!.data).map(
                ([key, value]) => (
                  <ListItem key={key}>
                    <ListItemText
                      primary={key}
                      secondary={JSON.stringify(value)}
                    ></ListItemText>
                  </ListItem>
                )
              )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onImageClick(undefined)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
