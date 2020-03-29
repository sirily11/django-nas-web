import React, { useContext, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, ListItem, CircularProgress } from "@material-ui/core";
import { HomePageContext } from "../../../../models/HomeContext";

import * as path from "path";
import { File as NasFile } from "../../../../models/Folder";
import { Grid, Card, Header, Icon } from "semantic-ui-react";
import { ContextMenuTrigger } from "react-contextmenu";

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
          <Autocomplete
            id="combo-box-demo"
            loading={isLoading}
            options={nas.searchedFiles ? nas.searchedFiles : []}
            getOptionLabel={option => path.basename(option.filename)}
            style={{
              width: "100%",
              paddingTop: "10px",
              paddingBottom: "10px",
              height: "100%"
            }}
            onChange={(e: any, v: NasFile | null, r: any) => {
              if (v) {
                window.location.href = `#/home/${v.parent}`;
                console.log("on change", v);
              }
            }}
            onClick={file => {
              console.log("onclick");
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Search File"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {isLoading ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  )
                }}
                onChange={async e => {
                  let keyword = e.target.value;
                  if (keyword.length > 1) {
                    setIsLoading(true);
                    await nas.search(e.target.value);
                    update();
                    setIsLoading(false);
                  }
                }}
              />
            )}
          />
        </Grid.Row>

        <Grid.Row>
          {/*Render documents*/}
          {nas.currentFolder &&
            nas.currentFolder.documents.map((f, i) => (
              <Grid.Column width={4} style={{ padding: 10 }}>
                <div
                  onMouseOver={() => setShadow(i)}
                  onMouseOut={() => setShadow(undefined)}
                  style={{ cursor: "grab" }}
                >
                  <Card
                    style={{ height: 100 }}
                    raised={shadow === i ? true : false}
                    onClick={async () => {
                      let document = await nas.getDocument(f.id);
                      selectDocument(document);
                    }}
                  >
                    <Header icon style={{ padding: 10 }} size="small">
                      <Icon name="file pdf" color="red" />
                      {f.name}
                    </Header>
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
