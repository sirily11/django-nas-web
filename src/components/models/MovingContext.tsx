import React, { Component } from "react";
import { Nas } from "./interfaces/nas";
import { RouteComponentProps } from "react-router";
import { Folder, Document as NasDocument, File as NasFile } from "./interfaces/Folder";
import { UploadInfo } from "../pages/home/components/files/dialog/UploadDialog";
//@ts-ignore

interface MovingContext {
  nas: Nas;
  update(): void;
}

interface MovingProps {}

export class MovingProvider extends Component<MovingProps, MovingContext> {
  constructor(props: MovingProps) {
    super(props);
    this.state = {
      nas: new Nas(),
      update: this.update
    };
  }

  update = () => {
    this.setState({
      nas: this.state.nas
    });
  };

  render() {
    return (
      <MovingContext.Provider value={this.state}>
        {this.props.children}
      </MovingContext.Provider>
    );
  }
}

const context: MovingContext = {
  nas: new Nas(),
  update: () => {}
};

export const MovingContext = React.createContext(context);
