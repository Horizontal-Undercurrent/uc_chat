import alt from "alt-client";
import native from "natives";

//@ts-ignore
import { isVisible, onClick, offClick, disable } from "alt:cursor";

type Options = {
  icon?: string;
  iconColor?: string;
  color?: string;
  test?: string;
};
enum Visible {
  VISIBLE,
  HIDDEN,
  ACTIVITY,
}

const view = new alt.WebView("http://resource/client/webview/dist/index.html");
const prefix = "/";

let visible: Visible = Visible.ACTIVITY;
let chatFocus = false;

view.on("load", () => {
  view.on("getSuggestions", (message: string) => {
    if (!message || !message.startsWith(prefix) || message.length < 2) {
      view.emit("getSuggestions", []);
      return;
    }

    message = message.substring(1, message.length);

    alt.emitServer("chat:getSuggestions", message.split(" ")[0]);
  });

  alt.on("keydown", (keycode) => {
    if (keycode !== alt.KeyCode.M) return;

    if (!isVisible() && visible !== Visible.HIDDEN) {
      showView();
      return;
    }

    if (chatFocus) return;

    view.unfocus();
    view.emit("unfocus");

    activityTimeout();
  });

  view.on("sendMessage", (message: string) => {
    if (message.length === 0) return;

    if (message.startsWith(prefix)) {
      const args = message.split(" ");
      const command = args[0].substring(1, args[0].length);

      args.splice(0, 1);

      alt.emitServer("chat:invokeCmd", command, args);
      return;
    }

    alt.emitServer("chat:sendMessage", message);
  });

  alt.onServer("chat:sendMessage", (username: string, message: string, options?: Options) => {
    view.emit("message", {
      content: message,
      username,
      ...(options ?? {}),
    });

    if (visible !== Visible.ACTIVITY) return;

    activityTimeout();

    showView();
  });

  view.on("blur", () => {
    chatFocus = false;
    disable(false);
  });

  view.on("focus", () => {
    chatFocus = true;
    disable(true);
  });
});

alt.onServer("chat:suggestions", (suggestions) => {
  view.emit("getSuggestions", suggestions);
});

alt.on("keydown", (keycode) => {
  if (keycode !== alt.KeyCode.T || chatFocus) return;

  if (visible === Visible.ACTIVITY) {
    hideView();
    visible = Visible.HIDDEN;
    view.emit("setVisible", "HIDDEN");
    return;
  }

  if (visible === Visible.HIDDEN) {
    showView();
    visible = Visible.VISIBLE;
    view.emit("setVisible", "VISIBLE");
    return;
  }

  if (visible === Visible.VISIBLE) {
    showView();
    activityTimeout();
    visible = Visible.ACTIVITY;
    view.emit("setVisible", "ACTIVITY");
    return;
  }
});

let timeout: number = null;
function activityTimeout() {
  if (timeout !== null) alt.clearTimeout(timeout);

  timeout = alt.setTimeout(() => {
    if (!isVisible() && visible === Visible.ACTIVITY) hideView();

    timeout = null;
  }, 5000);
}

spawnPed();

async function spawnPed() {
  const ped = new alt.LocalPed("A_M_M_Farmer_01", 0, alt.Player.local.pos, alt.Player.local.rot, true, 10);

  await ped.waitForSpawn();

  ped.frozen = true;

  const id = onClick({
    entity: ped,
    label: "Ask",
    icon: "faQuestion",
    cb: () => {
      alt.emitServer("chat:sendMessage", "Teszt");
    },
  });

  alt.on("resourceStop", () => offClick(id));
}

function hideView() {
  view.isVisible = false;
  view.unfocus();
  view.emit("unfocus");
}

function showView() {
  view.isVisible = true;
  view.focus();
}
