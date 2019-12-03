import * as React from "react";
import { StoreContext, Store } from "../Components/KeyValueStore";
import {
  ExternalRedirectContext,
  performExternalRedirect
} from "../externalRedirect";

type ExpressionType =
  | "AND"
  | "OR"
  | "EQUALS"
  | "MORE_THAN"
  | "MORE_THAN_OR_EQUALS"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUALS"
  | "NOT_EQUALS"
  | "ALWAYS";

export interface Expression {
  type: ExpressionType;
  key: any;
  value: any;
  text: string;
  subExpressions?: Expression[];
}

export const passes = (store: Store, expression: Expression): boolean => {
  if (expression.type === "AND") {
    return !expression
      .subExpressions!.map(exp => passes(store, exp))
      .includes(false);
  }

  if (expression.type === "OR") {
    return expression
      .subExpressions!.map(exp => passes(store, exp))
      .includes(true);
  }

  if (expression.type == "EQUALS") {
    return store[expression.key] == expression.value;
  }

  if (expression.type == "MORE_THAN") {
    return Number(store[expression.key]) > Number(expression.value);
  }

  if (expression.type == "MORE_THAN_OR_EQUALS") {
    return Number(store[expression.key]) >= Number(expression.value);
  }

  if (expression.type == "LESS_THAN") {
    return Number(store[expression.key]) < Number(expression.value);
  }

  if (expression.type == "LESS_THAN_OR_EQUALS") {
    return Number(store[expression.key]) <= Number(expression.value);
  }

  if (expression.type == "NOT_EQUALS") {
    return store[expression.key] != expression.value;
  }

  if (expression.type == "ALWAYS") {
    return true;
  }

  return false;
};

export const useGoTo = (
  data: any,
  onGoTo: (targetPassageId: string) => void
): ((name: string) => void) => {
  const { store } = React.useContext(StoreContext);
  const externalRedirectContext = React.useContext(ExternalRedirectContext);
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
          setGoTo(null);
          onGoTo(redirectTo.id);
          return;
        }
      }

      if (newPassage.externalRedirect) {
        setGoTo(null);
        performExternalRedirect(
          externalRedirectContext,
          newPassage.externalRedirect
        );
        return;
      }

      onGoTo(targetPassage);
    }

    setGoTo(null);
  }, [goTo]);

  return setGoTo;
};
