import React, { useContext, useState } from "react";
import { DocumentContext } from "../../../models/DocumentContext";
import {
  InputBase,
  TextField,
  makeStyles,
  IconButton,
  Tooltip,
  LinearProgress,
  ClickAwayListener
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import { Folder, Document as NasDocument } from "../../../models/Folder";
import EditorJS from "@editorjs/editorjs";
import ReactQuill, { Quill } from "react-quill";
import { DividerBlot } from "./blots/DividerBlot";

Quill.register(DividerBlot);
const useStyles = makeStyles(theme => ({
  notchedOutline: {
    "&:focus": {},
    border: 0,
    fontWeight: "normal",
    background: "transparent",
    fontSize: "20px"
  }
}));

export default function BodyEditor() {
  const { currentDocument, updateDocument, saveDocument } = useContext(
    DocumentContext
  );
  const [numChanges, setNumberOfChanges] = useState(0);
  const [editor, setEditor] = useState<ReactQuill | undefined>();

  const save = async () => {
    if (currentDocument && editor) {
      let data = editor.getEditor().getContents();
      currentDocument.content = data;
      updateDocument(currentDocument);
      await saveDocument();
      setNumberOfChanges(0);
    }
  };

  const modules = {
    toolbar: {
      container: "#toolbar"
    }
  };

  if (currentDocument === undefined) {
    return (
      <ReactQuill
        style={{
          height: "100%",
          border: 0,
          paddingBottom: "85px"
        }}
        modules={modules}
      />
    );
  }

  return (
    <ClickAwayListener
      onClickAway={async () => {
        if (numChanges > 0) {
          await save();
        }
      }}
    >
      <ReactQuill
        ref={instance => setEditor(instance != null ? instance : undefined)}
        onKeyDown={async () => {
          setNumberOfChanges(numChanges + 1);
          if (numChanges > 3) {
            await save();
          }
        }}
        onChange={async e => {}}
        style={{ height: "100%", border: 0, paddingBottom: "85px" }}
        defaultValue={currentDocument.content}
        modules={modules}
      />
    </ClickAwayListener>
  );
}
