/** @format */
import { File as NasFile } from "../../interfaces/Folder";


export abstract class BaseFileActionPlugin {
  /**
   * The title display when user click on file's action button
   */
  menuString: string;

  constructor() {
    this.menuString = "Base Plugin";
  }

  /**
   * Whether the menu should show.
   * Return true, show
   * @param nasFile Nas File
   */
  abstract shouldShow(nasFile: NasFile): boolean;

  /**
   * When action menu is clicked
   */
  abstract onClick(nasFile: NasFile): Promise<undefined> | Promise<Promise<any>>;
}
