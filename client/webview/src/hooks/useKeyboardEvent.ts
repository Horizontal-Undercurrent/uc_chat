import { useEffect } from "react";

const useKeyboardEvent = (key: string, cb: (event: KeyboardEvent) => void, deps?: any[]) => {
  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (event.key !== key) return;

      cb(event);
    };

    window.addEventListener("keydown", callback);

    return () => window.removeEventListener("keydown", callback);
  }, [key, ...(deps ?? [])]);
};

export default useKeyboardEvent;
