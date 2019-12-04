import React, { useContext, useState } from "react";
import { Button, Icon, Grid, Breadcrumb, Segment } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { HomePageContext } from "../../../models/HomeContext";
import UploadDialog from "./UploadDialog";
import NewFolderDialog from "./NewFolderDialog";
import Editor from "./Editor";

export default function Actions() {
  const { nas } = useContext(HomePageContext);

  const [open, setOpen] = useState(false);
  const [openNewFolder, setOpenNewFolder] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);

  return (
    <Grid>
      <Grid.Column floated="left" width={10} textAlign="left">
        <Breadcrumb size="large">
          <Breadcrumb.Section>
            <NavLink to="/home">Root</NavLink>
            <Breadcrumb.Divider icon="right chevron" />
          </Breadcrumb.Section>

          {nas.menus.map(m => (
            <Breadcrumb.Section key={`menu-${m.id}`}>
              <NavLink to={`/home/${m.id}`}>{m.name}</NavLink>
              <Breadcrumb.Divider icon="right chevron" />
            </Breadcrumb.Section>
          ))}
        </Breadcrumb>
      </Grid.Column>
      <Grid.Column floated="right" width={6} textAlign="right">
        <Button.Group>
          <Button icon onClick={() => setOpenNewFolder(true)}>
            <Icon name="folder" />
          </Button>
          <Button
            icon
            color="blue"
            onClick={() => setOpen(true)}
            disabled={nas.currentFolder === undefined}
          >
            <Icon name="upload" />
          </Button>
          <Button
            icon
            color="orange"
            onClick={() => setOpenEditor(true)}
            disabled={nas.currentFolder === undefined}
          >
            <Icon name="edit" />
          </Button>
        </Button.Group>
      </Grid.Column>
      <UploadDialog open={open} setOpen={setOpen}></UploadDialog>
      <NewFolderDialog
        open={openNewFolder}
        setOpen={setOpenNewFolder}
      ></NewFolderDialog>
      <Editor open={openEditor} setOpen={setOpenEditor}></Editor>
    </Grid>
  );
}
