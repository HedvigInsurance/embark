import { ApiContext } from "./../../Components/API/ApiContext";
import * as React from "react";
import { StoreContext } from "../../Components/KeyValueStore";
import {
  ExternalRedirectContext,
  performExternalRedirect
} from "../../externalRedirect";
import { passes } from "./expression";

export const useGoTo = (
  data: any,
  onGoTo: (targetPassageId: string) => void
): ((name: string) => void) => {
  const { store } = React.useContext(StoreContext);
  const { track } = React.useContext(ApiContext);
  const externalRedirectContext = React.useContext(ExternalRedirectContext);
  const [goTo, setGoTo] = React.useState<string | null>(null);
  const { setValue } = React.useContext(StoreContext);

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
          const { to, key, value } = passableExpressions[0];
          const redirectTo = data.passages.find(
            (passage: any) => passage.name == to
          );
          if (key !== null && value !== null) {
            setValue(key, value);
          }
          setGoTo(null);
          onGoTo(redirectTo.id);
          return;
        }
      }

      if (newPassage.externalRedirect) {
        track("External Redirect", {
          ...store,
          redirectLocation: newPassage.externalRedirect.data.location
        });
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
