/** @format */

import React from "react";
import { GalleryContext } from "../../../../models/GalleryContext";
import {
  makeStyles,
  Theme,
  createStyles,
  Button,
  Dialog,
  DialogContent,
} from "@material-ui/core";
import { Grid, CardMedia, Typography } from "@material-ui/core";
import LazyLoad from "react-lazyload";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      marginLeft: 20,
      marginRight: 20,
    },
    gridList: {
      width: "100%",
      height: "100%",
    },
  })
);

function getColSmall(index: number) {
  if (index % 7 === 0) {
    return 12;
  }
  return 6;
}

function getColLarge(index: number) {
  if (index % 5 === 0) {
    return 6;
  }
  return 3;
}

export default function ImageGrid() {
  const { files, fetchMore, nextURL, onImageClick } = React.useContext(
    GalleryContext
  );
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={classes.root}>
      <Grid container>
        {files.map((file, index) => (
          <Grid
            key={file.id}
            item
            md={getColLarge(index)}
            xs={getColSmall(index)}
            style={{ padding: 2, cursor: "grab", position: "relative" }}
            onClick={() => onImageClick(file)}
          >
            <LazyLoad once height={350} throttle={200} offset={100}>
              <CardMedia
                image={file.file}
                style={{ height: 350, width: "100%" }}
              />

              <div
                style={{
                  backgroundColor: "black",
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  margin: 2,
                }}
              >
                <Typography variant="h6" style={{ color: "white" }}>
                  {file.filename}
                </Typography>
                <Typography variant="h6" style={{ color: "white" }}>
                  {file.image_metadata?.data?.datetime}
                </Typography>
              </div>
            </LazyLoad>
          </Grid>
        ))}
        <Grid item xs={12}>
          {nextURL && (
            <Button
              onClick={fetchMore}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              Load More
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
