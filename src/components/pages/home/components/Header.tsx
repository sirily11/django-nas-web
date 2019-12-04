import React from "react";
import { Grid, Image, Icon } from "semantic-ui-react";

export default function Header() {
  return (
    <Grid columns={2} divided style={{ margin: 10 }}>
      <Grid.Row>
        <Grid.Column>
          <h1>Raspberry NAS</h1>
        </Grid.Column>
        <Grid.Column color="blue">
          <Icon name="database" size="huge"></Icon>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
