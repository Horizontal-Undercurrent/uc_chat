import { useState } from "react";
import useEmit from "./useEmit";
import useEvent from "./useEvent";

const useClientState = <T>(event: string, defaultValue: T, ...deps: any[]) => {
  const [state, setState] = useState(defaultValue);
  useEmit(event, ...deps);
  useEvent(event, setState);

  return state as T;
};

export default useClientState;
