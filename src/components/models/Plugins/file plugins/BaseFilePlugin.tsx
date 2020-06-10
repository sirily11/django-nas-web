/** @format */

import React, { Component } from "react";
import { File as NasFile } from "../../interfaces/Folder";

export interface Render {
  file: NasFile;
  onClose(): void;
}

export abstract class BaseFilePlugin {
  /**
   * Whether the plugin should open
   */
  abstract shouldShow(file: NasFile): boolean;

  abstract render(arg: Render): JSX.Element;
}
