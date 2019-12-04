import React from "react";
import { Progress } from "semantic-ui-react";

export default function ComputerStatus() {
  return (
    <div>
      <span>Avaliable Sapce: 128MB/2025MB</span>
      <Progress percent={30} progress color="green" />
    </div>
  );
}
