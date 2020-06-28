/** @format */

import React, { useContext } from "react";
import { HomePageContext } from "../../../../models/HomeContext";
import Rating from "@material-ui/lab/Rating";
import List from "@material-ui/core/List";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Icon, Grid, Item } from "semantic-ui-react";
import {
  ListItem,
  ListItemText,
  LinearProgress,
  Box,
  Typography,
} from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { SystemContext } from "../../../../models/SystemContext";

export default function UploadFilesSideBar() {
  const { uploadFiles, uploadInfo, uploadedFiles } = useContext(
    HomePageContext
  );
  const { systemInfo } = useContext(SystemContext);
  let filtedFiles = uploadFiles
    ? uploadFiles.filter((f) => !uploadedFiles.includes(f))
    : [];

  return (
    <List style={{ overflowY: "hidden", height: "100%", overflowX: "hidden" }}>
      {systemInfo && (
        <Grid>
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
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height - 100}
            itemCount={Math.min(3000, filtedFiles.length)}
            itemSize={80}
            width={width}
          >
            {({ index, style }) => (
              <ListItem key={`upload-${index}`} style={style}>
                <ListItemIcon>
                  <Icon name="file" />
                </ListItemIcon>
                <ListItemText
                  primary={filtedFiles[index].name}
                  secondary={
                    <LinearProgress
                      color="secondary"
                      variant={
                        uploadInfo && uploadInfo.currentIndex === index
                          ? "determinate"
                          : "determinate"
                      }
                      value={
                        uploadInfo && uploadInfo.currentIndex === index
                          ? uploadInfo.progress
                          : 0
                      }
                    />
                  }
                />
              </ListItem>
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
      {uploadFiles === undefined && (
        <Grid centered verticalAlign="middle">
          <div style={{ marginTop: "50px", marginBottom: "auto" }}>
            No Pending Uploads
          </div>
        </Grid>
      )}
    </List>
  );
}
