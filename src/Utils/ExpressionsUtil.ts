import * as React from "react";
import { StoreContext } from "../Components/KeyValueStore";

export const passes = (store: any, expression: any) => {
  if (expression.type == "EQUALS") {
    return store[expression.key] == expression.value;
  }

  if (expression.type == "MORE_THAN") {
    return store[expression.key] > expression.value;
  }

  if (expression.type == "MORE_THAN_OR_EQUALS") {
    return store[expression.key] >= expression.value;
  }

  if (expression.type == "LESS_THAN") {
    return store[expression.key] < expression.value;
  }

  if (expression.type == "LESS_THAN_OR_EQUALS") {
    return store[expression.key] <= expression.value;
  }

  if (expression.type == "NOT_EQUALS") {
    return store[expression.key] != expression.value;
  }

  if (expression.type == "ALWAYS") {
    return true;
  }

  return false;
};

export const goToHook = (
  data: any,
  onGoTo: (targetPassageId: string) => void
) => {
  const { store } = React.useContext(StoreContext);
  const [goTo, setGoTo] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (goTo) {
      const newPassage = data.passages.filter(
        (passage: any) => passage.name == goTo
      )[0];
      const targetPassage = newPassage ? newPassage.id : data.startPassage;

      if (newPassage.redirects.length > 0) {
        const passableExpressions = newPassage.redirects.filter(
          (expression: any) => {
            return passes(store, expression);
          }
        );

        if (passableExpressions.length > 0) {
          const { to } = passableExpressions[0];
          const redirectTo = data.passages.filter(
            (passage: any) => passage.name == to
          )[0];
          onGoTo(redirectTo.id);
          return;
        }
      }

      onGoTo(targetPassage);
    }

    setGoTo(null);
  }, [goTo]);

  return (name: string) => {
    setGoTo(name);
  };
};
