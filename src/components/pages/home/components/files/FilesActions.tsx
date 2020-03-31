import React, { useContext, useState } from "react";
import { HomePageContext } from "../../../../models/HomeContext";
import DeleteIcon from "@material-ui/icons/Delete";
import { Grid, Card, Header, Icon } from "semantic-ui-react";
import { IconButton } from "@material-ui/core";

export default function FilesActions() {
  const { nas, update, selectedDocument, selectDocument } = useContext(
    HomePageContext
  );
  const [isLoading, setIsLoading] = useState(false);
  const [shadow, setShadow] = useState<number>();

  return (
    <div style={{ width: "100%", margin: "20px" }}>
      <Grid>
        <Grid.Row>
          {/*Render documents*/}
          {nas.currentFolder &&
            nas.currentFolder.documents.map((f, i) => (
              <Grid.Column computer={4} mobile={8} style={{ padding: 10 }}>
                <div
                  onMouseOver={() => setShadow(i)}
                  onMouseOut={() => setShadow(undefined)}
                  style={{ cursor: "grab" }}
                >
                  <Card
                    style={{ height: 130 }}
                    raised={shadow === i ? true : false}
                  >
                    <Card.Content>
                      <Header icon style={{ padding: 10 }} size="small">
                        <Icon
                          onClick={async () => {
                            let document = await nas.getDocument(f.id);
                            selectDocument(document);
                          }}
                          name="file pdf"
                          color="red"
                        />
                        {f.name}
                        <IconButton
                          onClick={async () => {
                            await nas.deleteDocument(f.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Header>
                    </Card.Content>
                  </Card>
                </div>
              </Grid.Column>
            ))}
          {/*End Render documents*/}
        </Grid.Row>

        <Grid.Row>
          <h3>Files</h3>
        </Grid.Row>
      </Grid>
    </div>
  );
}
