/** @format */

import React from "react";

export interface JupyterCell {
  source: string[];
  cell_type: string;
  metadata: {
    id: string;
  };
}

export abstract class BaseCell {
  /**
   * Render cell based on this value. True means render by using this class.
   * @param type Cell's type
   */
  abstract cellType(type: string): boolean;

  abstract renderCell(cell: JupyterCell): JSX.Element;
}
