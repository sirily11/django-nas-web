import React, { Component } from "react";
import { Nas } from "./interfaces/nas";
import { RouteComponentProps } from "react-router";
import { SystemInfo } from "./interfaces/Folder";
import Axios from "axios";
import { systemURL } from "./urls";

interface SystemContext {
  systemInfo?: SystemInfo;
}

interface SystemProps {}

export class SystemProvider extends Component<SystemProps, SystemContext> {
  constructor(props: SystemProps) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    let info = await this.fetchSystemInfo();
    if (info) {
      this.setState({ systemInfo: info });
    }
    // setInterval(async () => {
    //   let info = await this.fetchSystemInfo();
    //   console.log("Update system info");
    //   if (info) {
    //     this.setState({ systemInfo: info });
    //   }
    // }, 20000);
  }

  fetchSystemInfo = async (): Promise<SystemInfo> => {
    let info = await Axios.get<SystemInfo>(systemURL);
    return Promise.resolve(info.data);
  };

  render() {
    return (
      <SystemContext.Provider value={this.state}>
        {this.props.children}
      </SystemContext.Provider>
    );
  }
}

const context: SystemContext = {};

export const SystemContext = React.createContext(context);
