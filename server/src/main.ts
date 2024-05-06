import alt from "alt-server";

type Command = {
  command: string;
  cb: (player: alt.Player, args?: { [key: string]: any }) => void;
  args?: Arg[];
};

type Arg = {
  name: string;
  desc: string;
  type?: string | number | alt.BaseObjectType.Player;
};

const commands: { [key: string]: Command } = {};

alt.onClient("chat:invokeCmd", (player: alt.Player, cmd: string, args: string[]) => {
  const command = commands[cmd];
  if (!command) return;

  if (!command.args) command.cb(player);
  if (command.args.length > args.length) return player.emit("chat:sendMessage", "Szerver", "Hianyzo argumentum");

  let valid = true;
  const res: { [key: string]: any } = {};

  for (const arg of command.args) {
    if (arg.type === null) continue;

    const arg2 = args[command.args.indexOf(arg)];

    switch (arg.type) {
      case "string":
        if (typeof arg2 !== "string") valid = false;
        break;
      case "number":
        if (typeof arg2 !== "number") valid = false;
        break;
      case alt.BaseObjectType.Player:
        const id = parseInt(arg2);
        if (isNaN(id)) {
          valid = false;
          break;
        }

        const ply = alt.Player.getByID(id);

        if (!ply) {
          valid = false;
          break;
        }

        res[arg.name] = player;
        break;
    }

    if (!valid) {
      player.emit(
        "chat:sendMessage",
        "Szerver",
        `${arg.name} - ${arg.type === alt.BaseObjectType.Player ? "player" : arg.type}`
      );
      break;
    }

    if (!res[arg.name]) res[arg.name] = arg2;
  }

  if (!valid) return;

  command.cb(player, res);
});

alt.onClient("chat:sendMessage", (player: alt.Player, message: string) => {
  alt.emitAllClients("chat:sendMessage", player.name, message.trimEnd());
});

alt.onClient("chat:getSuggestions", (player, command: string) => {
  const suggestions = [];

  for (const [key, value] of Object.entries(commands)) {
    if (!key.startsWith(command)) continue;
    const args = value.args ? value.args.map((arg) => `${arg.name} [${arg.desc}]`) : [];

    suggestions.push({
      command: key,
      args,
    });
  }

  player.emit("chat:suggestions", suggestions);
});

export function registerCommand(command: string, cb: Command["cb"], args?: Arg[]) {
  commands[command] = {
    command,
    cb,
    args,
  };
}

export function unregisterCommand(command: string) {
  if (commands[command]) delete commands[command];
}
