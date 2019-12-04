import React, { useContext } from "react";
import { Container, Grid } from "semantic-ui-react";
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
              used={parseFloat((systemInfo.disk.used / 1024 / 1024).toFixed(2))}
              total={parseFloat(
                (systemInfo.disk.total / 1024 / 1024).toFixed(2)
              )}
              title="Disk(MB)"
              color="#0088FE"
              color2="orange"
            />
          </Grid.Column>
          <Grid.Column>
            <PercentageChart
              used={parseFloat(
                (systemInfo.memory.used / 1024 / 1024).toFixed(2)
              )}
              total={parseFloat(
                (systemInfo.memory.total / 1024 / 1024).toFixed(2)
              )}
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
        </Grid>
      </Container>
    </div>
  );
}
