import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import LinkIcon from "@material-ui/icons/Link";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import {
  IconButton,
  makeStyles,
  Theme,
  createStyles,
  withStyles
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    divider: {
      height: "10px",
      borderLeft: "6px solid black"
    }
  })
);

const StyledToggleButtonGroup = withStyles(theme => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: "none",
    padding: theme.spacing(0, 1),
    "&:not(:first-child)": {
      borderRadius: theme.shape.borderRadius
    },
    "&:first-child": {
      borderRadius: theme.shape.borderRadius
    }
  }
}))(ToggleButtonGroup);
export default function ToolsBar() {
  const classes = useStyles();
  return (
    <div id="toolbar">
      <span className="ql-formats">
        <select className="ql-size">
          <option value="small"></option>
          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
        <button type="button" className="ql-italic"></button>
        <button type="button" className="ql-underline"></button>
        <span className="ql-formats">
          <button type="button" className="ql-indent" value="-1"></button>
          <button type="button" className="ql-indent" value="+1"></button>
          <select className="ql-align">
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>
          <button type="button" className="ql-direction" value="rtl"></button>
          <button type="button" className="ql-list" value="ordered"></button>
          <button type="button" className="ql-list" value="bullet"></button>
        </span>
        <span className="ql-formats">
          <button type="button" className="ql-image"></button>
          <button type="button" className="ql-code-block"></button>
          <button type="button" className="ql-script" value="sub"></button>
          <button type="button" className="ql-script" value="super"></button>
          <button type="button" className="ql-clean"></button>
        </span>
      </span>
    </div>
  );
}
