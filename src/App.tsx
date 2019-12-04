import React, { Component } from "react";
import "./App.css";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import {
  spring,
  AnimatedRoute,
  AnimatedSwitch
} from "./components/plugins/react-router-transition";
import { HomePage } from "./components/pages/home/HomePage";
import { HomePageProvider } from "./components/models/HomeContext";

class App extends Component {
  render() {
    return (
      <Router>
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className="switch-wrapper"
        >
          <Route
            exact
            path="/:id?"
            component={(props: any) => (
              <HomePageProvider {...props}>
                <HomePage></HomePage>
              </HomePageProvider>
            )}
          />
        </AnimatedSwitch>
      </Router>
    );
  }
}

export default App;
