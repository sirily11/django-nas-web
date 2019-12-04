import React from "react";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Segment } from "semantic-ui-react";

interface Props {
  title: string;
  used: number;
  total: number;
  color: string;
  color2: string;
}
const data02 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 }
];
export default function PercentageChart(props: Props) {
  const { title, used, total, color, color2 } = props;
  let data = [
    {
      name: "Used",
      value: used
    },
    { name: "Available", value: total - used }
  ];

  return (
    <Segment>
      <ResponsiveContainer
        minHeight={300}
        height="100%"
        width="100%"
        minWidth={200}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            label
            fill={color}
            isAnimationActive={false}
          >
            <Cell fill={color}></Cell>
            <Cell fill={color2}></Cell>
          </Pie>

          <Tooltip></Tooltip>
        </PieChart>
      </ResponsiveContainer>
      <span>{title}</span>
    </Segment>
  );
}
