import React, { useContext } from "react";
import { HomePageContext } from "../../../../models/HomeContext";
import List from "@material-ui/core/List";
import { Icon, Grid, Item } from "semantic-ui-react";
import { ListItem, ListItemText, LinearProgress } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";

export default function UploadFilesSideBar() {
  const { uploadFiles, uploadInfo } = useContext(HomePageContext);

  return (
    <List>
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
