import { FC } from "react";
import useClientState from "../hooks/useClientState";
import { ScrollArea, Stack } from "@mantine/core";
import Suggestion from "./Suggestion";

type Props = {
  message?: string;
};

export interface ISuggestion {
  command: string;
  args: string[];
}

const Suggestions: FC<Props> = ({ message }) => {
  const suggestions: ISuggestion[] = useClientState("getSuggestions", [], message);

  return (
    <ScrollArea h={suggestions.length === 0 ? 0 : 200}>
      <Stack gap={5}>
        {!message || message.length === 1 ? null : suggestions.map((sugg, i) => <Suggestion key={i} {...sugg} />)}
      </Stack>
    </ScrollArea>
  );
};

export default Suggestions;
