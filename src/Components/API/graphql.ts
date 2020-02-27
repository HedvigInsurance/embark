import { GraphQLApiComponent, ApiComponent } from "./apiComponent";

export const isGraphqlApi = (t?: ApiComponent): t is GraphQLApiComponent =>
  (t && t.component === "GraphQLApi") || false;
