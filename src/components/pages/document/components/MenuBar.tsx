import React from "react";
import { Grid } from "semantic-ui-react";
import { Button, makeStyles, MenuItem, Menu } from "@material-ui/core";
import NestedMenuItem from "material-ui-nested-menu-item";
import { DocumentContext } from "../../../models/DocumentContext";

const useStyles = makeStyles(theme => ({
  button: {
    padding: "4px 6px",
    minWidth: "40px",
    fontSize: "14px",
    fontWeight: "normal",
    textTransform: "capitalize"
  },
  menuItem: {
    minWidth: 150
  }
}));

export default function MenuBar() {
  const classes = useStyles();
  const { isLoading, saveToLocal, oepnFromLocal } = React.useContext(
    DocumentContext
  );
  const [fileEl, setfileEl] = React.useState<null | HTMLElement>(null);

  return (
    <div>
      <Button
        className={classes.button}
        size="small"
        onClick={e => setfileEl(e.currentTarget)}
      >
        File
      </Button>
      <Button className={classes.button} size="small">
        Edit
      </Button>
      <Button className={classes.button} size="small">
        Settings
      </Button>
      <Button className={classes.button} size="small">
        Tools
      </Button>
      <Button className={classes.button} size="small">
        Help
      </Button>
      <span
        style={{ textDecoration: "underline", color: "grey", marginLeft: 20 }}
      >
        {isLoading ? "Commnucating with server" : "All changes saved in Drive"}
      </span>
      <Menu
        anchorEl={fileEl}
        keepMounted
        open={Boolean(fileEl)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={() => {
          setfileEl(null);
        }}
      >
        <MenuItem
          onClick={async () => {
            await oepnFromLocal();
            setfileEl(null);
          }}
        >
          Open
        </MenuItem>
        <NestedMenuItem
          label="Download"
          parentMenuOpen={Boolean(fileEl)}
          className={classes.menuItem}
        >
          <MenuItem
            className={classes.menuItem}
            onClick={async () => {
              await saveToLocal("pdf");
              setfileEl(null);
            }}
          >
            PDF Document (.pdf){" "}
          </MenuItem>
          <MenuItem
            className={classes.menuItem}
            onClick={async () => {
              await saveToLocal("html");
              setfileEl(null);
            }}
          >
            Web Page (.html){" "}
          </MenuItem>
        </NestedMenuItem>
      </Menu>
    </div>
  );
}
