import * as React from "react";
import { TopBar } from "../TopBar";
import { Introduction } from "./Introduction";
import { Perils } from "./Perils/index";

export const Offer = () => (
  <>
    <TopBar />
    <Introduction />
    <Perils />
  </>
);
