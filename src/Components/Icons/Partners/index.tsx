import * as React from "react";
import { WordmarkXSEB } from "./SEB";
import { WordmarkXDreams } from "./Dreams";
import { Wordmark } from "../Wordmark";

export type Partner = "seb" | "dreams";

interface Props {
  partner: Partner;
}

export const PartnerWordmark: React.FC<Props> = props => {
  if (props.partner === "seb") {
    return <WordmarkXSEB />;
  }

  if (props.partner === "dreams") {
    return <WordmarkXDreams />;
  }

  return <Wordmark />;
};
