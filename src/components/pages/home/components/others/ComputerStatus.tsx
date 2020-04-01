import React, { useContext } from "react";
import { Progress, Message } from "semantic-ui-react";
import { SystemContext } from "../../../../models/SystemContext";
import { formatBytes } from "../files/utils";

export default function ComputerStatus() {
  const { systemInfo } = useContext(SystemContext);
  if (systemInfo === undefined) {
    return (
      <Message>
        <p>No Info Avaliable currently</p>
      </Message>
    );
  }
  return (
    <div>
      <span>
        Used Sapce: {formatBytes(systemInfo.disk.used)}/
        {formatBytes(systemInfo.disk.total)}
      </span>
      <Progress
        percent={((systemInfo.disk.used / systemInfo.disk.total) * 100).toFixed(
          2
        )}
        size="tiny"
        color="green"
      />
    </div>
  );
}
