import React, { useContext } from "react";
import { Progress, Message } from "semantic-ui-react";
import { SystemContext } from "../../../models/SystemContext";

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
        Used Sapce: {(systemInfo.disk.used / 1024 / 1024).toFixed(2)}MB/
        {(systemInfo.disk.total / 1024 / 1024).toFixed(2)}MB
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
