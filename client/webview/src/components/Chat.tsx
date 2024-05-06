import { Box, ScrollArea, Stack } from "@mantine/core";
import Message, { IMessage } from "./Message";
import { useEffect, useRef, useState } from "react";
import useEvent from "../hooks/useEvent";
import MessageInput from "./MessageInput";

// const initMessages: IMessage[] = [];

// for (let i = 0; i < 30; i++)
//   initMessages.push({
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero aspernatur reprehenderit ipsum a vitae praesentium voluptatum recusandae magnam, aliquid incidunt, sed libero repellat cum nostrum, mollitia dolor ducimus doloremque nulla!",
//     username: "User-" + i,
//     icon: "home",
//     iconColor: "red",
//   });

const Chat = () => {
  const [messages, setMessages] = useState([] as IMessage[]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEvent("message", (message: IMessage) => {
    setMessages((old) => [...old, message]);
  });

  useEffect(() => {
    if (!scrollAreaRef.current) return;

    scrollAreaRef.current.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
    });

    if (messages.length <= 30) return;

    setMessages((current) => current.splice(0, 1));
  }, [messages]);

  return (
    <Box w={600} h={400} p={10} pos="relative">
      <ScrollArea w="100%" h="inherit" viewportRef={scrollAreaRef} mb={10}>
        <Stack gap={10} justify="revert">
          {messages.map((msg, i) => (
            <Message key={i} {...msg} />
          ))}
        </Stack>
      </ScrollArea>
      <MessageInput />
    </Box>
  );
};

export default Chat;
