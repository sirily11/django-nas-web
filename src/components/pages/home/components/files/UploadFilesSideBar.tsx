import React, { useContext } from "react";
import { HomePageContext } from "../../../../models/HomeContext";
import Rating from "@material-ui/lab/Rating";
import List from "@material-ui/core/List";
import { Icon, Grid, Item } from "semantic-ui-react";
import {
  ListItem,
  ListItemText,
  LinearProgress,
  Box,
  Typography
} from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { SystemContext } from "../../../../models/SystemContext";

export default function UploadFilesSideBar() {
  const { uploadFiles, uploadInfo } = useContext(HomePageContext);
  const { systemInfo } = useContext(SystemContext);

  return (
    <List>
      {systemInfo && (
        <Grid style={{ height: "100%", marginTop: 10 }}>
          <Grid.Row>
            <Grid.Column width={8}>
              <Typography component="legend">CPU</Typography>
              <Rating
                name="read-only"
                value={(5 * systemInfo.cpu) / 100}
                readOnly
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Typography component="legend">Memory</Typography>
              <Rating
                name="read-only"
                value={(5 * systemInfo.memory.used) / systemInfo.memory.total}
                readOnly
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}

      {uploadFiles ? (
        uploadFiles.map((f, i) => (
          <ListItem>
            <ListItemIcon>
              <Icon name="file" />
            </ListItemIcon>
            <ListItemText
              primary={f.name}
              secondary={
                <LinearProgress
                  variant={
                    uploadInfo && uploadInfo.currentIndex === i
                      ? "determinate"
                      : "indeterminate"
                  }
                  value={
                    uploadInfo && uploadInfo.currentIndex === i
                      ? uploadInfo.progress
                      : undefined
                  }
                />
              }
            />
          </ListItem>
        ))
      ) : (
        <Grid style={{ height: "100%" }} centered verticalAlign="middle">
          <div style={{ marginTop: "10px", marginBottom: "auto" }}>
            No Pending Uploads
          </div>
        </Grid>
      )}
    </List>
  );
}
