import React, { useContext } from "react";
import { Container, Grid, Segment } from "semantic-ui-react";
import { SystemContext } from "../../models/SystemContext";
import PercentageChart from "./PercentageChart";

export default function SystemInfoPage() {
  const { systemInfo } = useContext(SystemContext);
  if (systemInfo === undefined) {
    return <div>Infomation Not Available</div>;
  }

  return (
    <div id="home" style={{ width: "100%", color: "black" }}>
      <Container>
        <h1>System Info</h1>
        <Grid columns={2}>
          <Grid.Column>
            <PercentageChart
              used={Math.round(systemInfo.disk.used / 1024 / 1024)}
              total={Math.round(systemInfo.disk.total / 1024 / 1024)}
              title="Disk(MB)"
              color="#0088FE"
              color2="orange"
            />
          </Grid.Column>
          <Grid.Column>
            <PercentageChart
              used={Math.round(systemInfo.memory.used / 1024 / 1024)}
              total={Math.round(systemInfo.memory.total / 1024 / 1024)}
              title="Memory(MB)"
              color="#0088FE"
              color2="orange"
            />
          </Grid.Column>
          <Grid.Column>
            <PercentageChart
              used={systemInfo.cpu}
              total={100}
              title="CPU Usage(Percentage)"
              color="#0088FE"
              color2="orange"
            />
          </Grid.Column>
          <Grid.Column>
            <Segment style={{ height: "100%" }}>
              <h4>Temperature</h4>
              <h1>
                {systemInfo.temperature
                  ? systemInfo.temperature.toFixed(1)
                  : "None"}
              </h1>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment style={{ height: "100%" }}>
              <h4>Humidity</h4>
              <h1>
                {systemInfo.humidity ? systemInfo.humidity.toFixed(1) : "None"}
              </h1>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment style={{ height: "100%" }}>
              <h4>Pressure</h4>
              <h1>
                {systemInfo.pressure ? systemInfo.pressure.toFixed(2) : "None"}
              </h1>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
}
