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
          <Grid.Row style={{ height: 40 }}>
            <Grid.Column width={8}>
              <div>CPU</div>
              <LinearProgress
                color="secondary"
                variant="determinate"
                value={systemInfo.cpu}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <div>Memory</div>
              <LinearProgress
                title="Memory"
                color="secondary"
                variant="determinate"
                value={(systemInfo.memory.used / systemInfo.memory.total) * 100}
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
                  color="secondary"
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
