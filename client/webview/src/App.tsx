import Chat from "./components/Chat";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as Icons from "@fortawesome/free-solid-svg-icons";

const iconList = Object.keys(Icons)
  .filter((key) => key !== "fas" && key !== "prefix")
  //@ts-ignore
  .map((icon) => Icons[icon]);

library.add(...iconList);

function App() {
  return <Chat />;
}

export default App;
