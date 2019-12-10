import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";

interface Measured {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function useMeasure<T extends Element>() {
  const ref = React.useRef<T>();
  const [bounds, set] = React.useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });
  const [ro] = React.useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect))
  );
  React.useEffect(() => {
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [{ ref }, bounds] as [{ ref: React.MutableRefObject<T> }, Measured];
}
