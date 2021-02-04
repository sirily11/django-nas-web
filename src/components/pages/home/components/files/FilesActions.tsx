/** @format */

import React, { useContext, useState } from "react";
import { HomePageContext } from "../../../../models/HomeContext";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  IconButton,
  Card,
  CardActions,
  CardContent,
  Typography,
  CardActionArea,
  Grid,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import {
  Folder,
  Document as NasDocument,
} from "../../../../models/interfaces/Folder";
import RenameDialog from "./dialog/RenameDialog";
import { NavLink } from "react-router-dom";

export default function FilesActions() {
  const { nas, update } = useContext(HomePageContext);
  const [isLoading, setIsLoading] = useState(false);
  const [shadow, setShadow] = useState<number>();
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<NasDocument>();

  return (
    <div style={{ width: "100%", margin: "20px" }}>
      <Grid container spacing={3}>
        {/*Render documents*/}
        {nas.currentFolder &&
          nas.currentFolder.documents.map((f, i) => (
            <Grid item xs={6} md={3} key={`document-${i}`}>
              <Card variant="outlined" raised={shadow === i ? true : false}>
                <NavLink to={`/document/${f.id}`}>
                  <CardActionArea style={{ height: 80 }}>
                    <CardContent>
                      <h3>{f.name}</h3>
                    </CardContent>
                  </CardActionArea>
                </NavLink>
                <CardActions>
                  <IconButton
                    onClick={async () => {
                      await nas.deleteDocument(f.id);
                      update();
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={async () => {
                      setSelectedDocument(f);
                      setShowRenameDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        {/*End Render documents*/}
      </Grid>
      {selectedDocument && (
        <RenameDialog
          type="document"
          open={showRenameDialog}
          selectedFile={selectedDocument}
          onClose={() => {
            setShowRenameDialog(false);
            setSelectedDocument(undefined);
            update();
          }}
        />
      )}
    </div>
  );
}
