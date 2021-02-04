/** @format */

import { Menu, PopoverPosition } from "@material-ui/core";
import React from "react";
import { ContextMenuContext, ContextMenuType } from "./ContextMenuContext";

interface Props {
  contextMenuType: ContextMenuType;
  children: (show: boolean) => React.ReactNode;
}

export default function ContextMenu(props: Props) {
  const { contextMenuData, closeContextMenu } = React.useContext(
    ContextMenuContext
  );
  const { contextMenuType, children } = props;
  const [anchorPosition, setAnchorPosition] = React.useState<PopoverPosition>();
  React.useEffect(() => {
    let pos =
      contextMenuData &&
      contextMenuType === contextMenuData.menuType &&
      contextMenuData.mouseY !== null &&
      contextMenuData.mouseX !== null
        ? { top: contextMenuData.mouseY, left: contextMenuData.mouseX }
        : undefined;

    setAnchorPosition(pos);
  }, [contextMenuData]);
  const child = children(anchorPosition !== undefined);
  return (
    <Menu
      autoFocus={false}
      open={anchorPosition !== undefined}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      onClose={() => {
        closeContextMenu();
      }}
    >
      {child}
    </Menu>
  );
}
