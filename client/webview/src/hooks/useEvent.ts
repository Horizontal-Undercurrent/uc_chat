import { useEffect } from "react";

const useEvent = (event: string, cb: (...args: any[]) => void) => {
  useEffect(() => {
    if (!window.alt) return;

    alt.on(event, cb);
  }, []);
};

export default useEvent;
