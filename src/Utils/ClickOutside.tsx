import * as React from "react";

interface ClickOutsideProps {
  on: (e: MouseEvent) => void;
}

const useOuterClickNotifier = (
  onOuterClick: (e: MouseEvent) => void,
  innerRef: React.RefObject<any>
) => {
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) =>
      innerRef.current &&
      !innerRef.current.contains(e.target) &&
      onOuterClick(e);

    if (innerRef.current) {
      document.addEventListener("click", handleClick);
    }

    return () => document.removeEventListener("click", handleClick);
  }, [onOuterClick, innerRef]);
};

export const ClickOutside = (
  props: React.PropsWithChildren<ClickOutsideProps>
) => {
  const ref = React.useRef(null);
  useOuterClickNotifier(props.on, ref);
  return <div ref={ref}>{props.children}</div>;
};
