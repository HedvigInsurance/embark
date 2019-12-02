import * as React from "react";
import { WordmarkXDreams } from "./SEB";
import { Wordmark } from "../Wordmark";

export type Partner = "seb" | "dreams";

interface Props {
  partner: Partner;
}

export const PartnerWordmark: React.FC<Props> = props => {
  if (props.partner === "seb") {
    return <WordmarkXDreams />;
  }

  if (props.partner === "dreams") {
    return <WordmarkXDreams />;
  }

  return <Wordmark />;
};
