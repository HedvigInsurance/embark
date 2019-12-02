import * as React from "react";

export interface TExternalRedirectContext {
  Offer: () => void;
}

export const ExternalRedirectContext = React.createContext<
  TExternalRedirectContext
>({
  Offer: () => {
    throw Error(
      "Must provide an implementation for `ExternalRedirectContext.Offer`"
    );
  }
});

interface ExternalRedirect {
  component: "ExternalRedirect";
  data: {
    location: "Offer";
  };
}
export const performExternalRedirect = (
  context: TExternalRedirectContext,
  externalRedirect: ExternalRedirect
) => {
  if (externalRedirect.data.location === "Offer") {
    context.Offer();
  }
};
