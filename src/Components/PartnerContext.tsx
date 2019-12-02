import * as React from "react";

export const PartnerContext = React.createContext<{ partnerImageUrl?: string }>(
  { partnerImageUrl: undefined }
);
