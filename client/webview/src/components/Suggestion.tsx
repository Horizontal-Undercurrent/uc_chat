import { type FC } from "react";
import { ISuggestion } from "./Suggestions";
import { Card, Group } from "@mantine/core";

const Suggestion: FC<ISuggestion> = ({ command, args }) => {
  return (
    <Card p={10}>
      <Group>
        <div>{command}</div>
        <div>{args?.join(" ")}</div>
      </Group>
    </Card>
  );
};

export default Suggestion;
