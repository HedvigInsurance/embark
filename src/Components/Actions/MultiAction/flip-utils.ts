import { spring } from "react-flip-toolkit";

export const onElementAppear = (el: HTMLDivElement) =>
  spring({
    config: { overshootClamping: true, stiffness: 280, damping: 30 },
    onUpdate: (val: number) => {
      el.style.opacity = `${val}`;
      el.style.transform = `scaleX(${val})`;
    },
    delay: 0
  });

export const onExit = (
  el: HTMLDivElement,
  _: any,
  removeElement: () => void
) => {
  spring({
    config: { overshootClamping: true, stiffness: 280, damping: 30 },
    onUpdate: (val: number) => {
      el.style.opacity = `${1 - val}`;
      el.style.transform = `scaleX(${1 - val})`;
    },
    delay: 0,
    onComplete: removeElement
  });

  return () => {
    el.style.opacity = "";
    removeElement();
  };
};
