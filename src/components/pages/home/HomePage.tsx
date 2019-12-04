import React from "react";
import Header from "./components/Header";
import "semantic-ui-css/semantic.min.css";
import ListPanel from "./components/ListPanel";
import { Container, Segment, Progress } from "semantic-ui-react";
import Actions from "./components/Actions";
import ComputerStatus from "./components/ComputerStatus";

export function HomePage() {
  return (
    <div id="home">
      <Container>
        <Header />
        <Segment>
          <Actions />
          <ListPanel />
          <ComputerStatus />
        </Segment>
      </Container>
    </div>
  );
}
