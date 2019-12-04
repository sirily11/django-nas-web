import React, { Component } from "react";
import { Nas } from "./nas";
import { RouteComponentProps } from "react-router";

interface RouterProps {
  id: string;
}

interface HomePageContext {
  nas: Nas;
  update(): void;
  isLoading: boolean;
}

interface HomePageProps extends RouteComponentProps<RouterProps> {}

export class HomePageProvider extends Component<
  HomePageProps,
  HomePageContext
> {
  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      nas: new Nas(),
      update: this.update,
      isLoading: false
    };
  }

  async componentDidUpdate(oldProps: HomePageProps) {
    if (this.props.match.params.id !== oldProps.match.params.id) {
      let id = this.props.match.params.id;
      await this.fetch(id);
    }
  }

  async componentWillMount() {
    let id = this.props.match.params.id;
    await this.fetch(id);
  }

  fetch = async (id: any) => {
    this.setState({ isLoading: true });
    const { nas } = this.state;
    await nas.getContent(id);
    this.setState({ nas, isLoading: false });
  };

  update = () => {
    this.setState({
      nas: this.state.nas
    });
  };

  render() {
    return (
      <HomePageContext.Provider value={this.state}>
        {this.props.children}
      </HomePageContext.Provider>
    );
  }
}

const context: HomePageContext = {
  nas: new Nas(),
  update: () => {},
  isLoading: false
};

export const HomePageContext = React.createContext(context);
