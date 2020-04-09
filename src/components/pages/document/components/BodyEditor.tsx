import React, { useContext, useState } from "react";
import { DocumentContext } from "../../../models/DocumentContext";
import {
  InputBase,
  TextField,
  makeStyles,
  IconButton,
  Tooltip,
  LinearProgress
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import { Folder, Document as NasDocument } from "../../../models/Folder";
import EditorJS from "@editorjs/editorjs";
import ReactQuill, { Quill } from "react-quill";

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
        style={{ height: "100%", border: 0, paddingBottom: "85px" }}
        modules={modules}
      />
    );
  }

  return (
    <ReactQuill
      ref={instance => setEditor(instance != null ? instance : undefined)}
      onBlur={async () => {
        if (numChanges > 0) {
          await save();
        }
      }}
      onChange={async () => {
        setNumberOfChanges(numChanges + 1);
        if (numChanges > 3) {
          await save();
        }
      }}
      style={{ height: "100%", border: 0, paddingBottom: "85px" }}
      defaultValue={currentDocument.content}
      modules={modules}
    />
  );
}
