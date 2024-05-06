import { Box, Card, Group, rem, Stack, Text } from "@mantine/core";
import { type FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface IMessage {
  content: string;
  username: string;
  icon?: string;
  iconColor?: string;
  color?: string;
  text?: string;
}

const Message: FC<IMessage> = ({ content, username, icon, iconColor, color, text }) => {
  return (
    <Card p={10} c={text} bg={color}>
      <Stack gap={0}>
        <Group gap={5} align="center" c={iconColor ? iconColor : ""}>
          <FontAwesomeIcon
            icon={icon as IconProp}
            style={{
              fontSize: rem(12),
            }}
          />
          <Text>{username}</Text>
        </Group>
        <Box left={10} pos="relative">
          <Text>{content}</Text>
        </Box>
      </Stack>
    </Card>
  );
};

export default Message;
