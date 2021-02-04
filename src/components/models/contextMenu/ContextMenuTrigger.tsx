/** @format */

import React from "react";
import {
  ContextMenuProvider,
  ContextMenuType,
  ContextMenuContext,
} from "./ContextMenuContext";
import {
  File as NasFile,
  Folder as NasFolder,
  Document as NasDocument,
} from "../interfaces/Folder";

interface Props {
  contextMenuType: ContextMenuType;
  file?: NasFile;
  folder?: NasFolder;
  document?: NasDocument;
  children: React.ReactNode;
}

export default function ContextMenuTrigger(props: Props) {
  return <ContextMenuComponent {...props} />;
}

function ContextMenuComponent(props: Props) {
  const { file, folder, document, contextMenuType, children } = props;
  const {
    openContextMenu,
    closeContextMenu,
    contextMenuData,
  } = React.useContext(ContextMenuContext);
  return (
    <div
      style={{ height: "100%" }}
      onContextMenu={(e) => {
        e.preventDefault();
        openContextMenu({
          file: file,
          folder: folder,
          menuType: contextMenuType,
          mouseX: e.clientX + 2,
          mouseY: e.clientY + 2,
        });
      }}
    >
      {children}
    </div>
  );
}
