import { useEffect } from "react";

const useEmit = (event: string, ...deps: any[]) => {
  useEffect(() => {
    if (!window.alt) return;

    alt.emit(event, ...deps);
  }, deps);
};

export default useEmit;
