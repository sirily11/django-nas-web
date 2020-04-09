import React, { useContext, useState } from "react";
import { HomePageContext } from "../../../../models/HomeContext";
import DeleteIcon from "@material-ui/icons/Delete";
import { Grid, Header, Icon } from "semantic-ui-react";
import {
  IconButton,
  Card,
  CardActions,
  CardContent,
  Typography,
  CardActionArea
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { Folder, Document as NasDocument } from "../../../../models/Folder";
import RenameDialog from "./RenameDialog";
import { NavLink } from "react-router-dom";

export default function FilesActions() {
  const { nas, update } = useContext(HomePageContext);
  const [isLoading, setIsLoading] = useState(false);
  const [shadow, setShadow] = useState<number>();
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<NasDocument>();

  return (
    <div style={{ width: "100%", margin: "20px" }}>
      <Grid>
        <Grid.Row>
          {/*Render documents*/}
          {nas.currentFolder &&
            nas.currentFolder.documents.map((f, i) => (
              <Grid.Column
                computer={4}
                mobile={8}
                style={{ padding: 10 }}
                key={`document-${i}`}
              >
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
              </Grid.Column>
            ))}
          {/*End Render documents*/}
        </Grid.Row>

        <Grid.Row>
          <h3>Files</h3>
        </Grid.Row>
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
