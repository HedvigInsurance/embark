import * as React from "react";
import { Partner } from "./Icons/Partners";

interface TPartnerContext {
  partner?: Partner;
}

export const PartnerContext = React.createContext<TPartnerContext>({
  partner: undefined
});
