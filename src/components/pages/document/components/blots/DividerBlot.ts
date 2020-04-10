import Parchment from "parchment";
import { Quill } from "react-quill";

const BlockEmbed = Quill.import('blots/block/embed') as { new(node: any, value: any): Object };
export class DividerBlot extends BlockEmbed {
  static blotName = 'divider';
  static tagName = 'hr';
}
