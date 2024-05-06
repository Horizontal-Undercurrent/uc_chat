import { Box, Stack, Text, Textarea } from "@mantine/core";
import Suggestions from "./Suggestions";
import { ChangeEventHandler, useState } from "react";
import useKeyboardEvent from "../hooks/useKeyboardEvent";
import useEvent from "../hooks/useEvent";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState("activity");

  useEvent("setVisible", setVisible);

  useKeyboardEvent(
    "Enter",
    () => {
      if (!window.alt) return;

      alt.emit("sendMessage", message);

      setMessage("");
    },
    [message]
  );
  useEvent("unfocus", () => {
    (document.activeElement as HTMLInputElement)?.blur();
  });

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    event.preventDefault();

    const regex = /^[^\s]+(\s[^\s]+)*(\s?)$/;

    if (event.target.value && !regex.test(event.target.value)) return;

    setMessage(event.target.value);
  };

  const handleFocus = () => alt.emit("focus");
  const handleBlur = () => alt.emit("blur");

  return (
    <Stack gap={5} pos="relative">
      <Textarea rows={3} onChange={handleChange} value={message} onFocus={handleFocus} onBlur={handleBlur}></Textarea>
      <Suggestions message={message} />
      <Box
        pos="absolute"
        right={0}
        bottom={0}
        style={{
          transform: "translateY(100%)",
        }}
      >
        <Text>{visible}</Text>
      </Box>
    </Stack>
  );
};

export default MessageInput;
