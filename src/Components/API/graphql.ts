import get from "lodash.get";
import { GraphQLError, ExecutionResult } from "graphql";

import { GraphQLApiComponent, ApiComponent } from "./apiComponent";
import { TApiContext } from "./ApiContext";
import { Store } from "../KeyValueStore";

export const isGraphqlApi = (t?: ApiComponent): t is GraphQLApiComponent =>
  t?.component === "GraphQLApi";

export const graphQLApiHandler = async (
  component: ApiComponent,
  apiContext: TApiContext,
  store: Store,
  setValue: (key: string, value: string) => void,
  changePassage: (name: string) => void
) => {
  if (!isGraphqlApi(component)) {
    throw new Error("passed non graphql api to graphQLApiHandler");
  }

  try {
    const variables = component.data.variables.reduce((curr, variable) => {
      switch (variable.as) {
        case "string":
          return { ...curr, [variable.key]: String(store[variable.from]) };
        case "int":
          return { ...curr, [variable.key]: parseInt(store[variable.from]) };
        default:
          return { ...curr, [variable.key]: store[variable.from] };
      }
    }, {});

    const handleErrors = (graphqlResult: ExecutionResult<any>) => {
      const error = component.data.errors.find(error =>
        graphqlResult
          .errors!.map((graphQLError: GraphQLError) => {
            if (error.contains) {
              return graphQLError.message.includes(error.contains);
            }

            return true;
          })
          .includes(true)
      );

      if (error) {
        changePassage(error.next.name);
      }
    };

    const handleData = (graphqlResult: ExecutionResult<any>) => {
      component.data.results.forEach(result => {
        setValue(result.as, get(graphqlResult.data!, result.key));
      });

      changePassage(component.data.next.name);
    };

    if (component.data.query) {
      const graphqlQueryResult = await apiContext.graphqlQuery(
        component.data.query,
        variables
      );

      if (graphqlQueryResult.data) {
        handleData(graphqlQueryResult);
      } else if (graphqlQueryResult.errors) {
        handleErrors(graphqlQueryResult);
      }

      return;
    } else if (component.data.mutation) {
      const graphqlMutationResult = await apiContext.graphqlMutation(
        component.data.mutation,
        variables
      );

      if (graphqlMutationResult.data) {
        handleData(graphqlMutationResult);
      } else if (graphqlMutationResult.errors) {
        handleErrors(graphqlMutationResult);
      }

      return;
    }

    throw new Error("neither mutation or query was passed to graphql api");
  } catch (e) {
    console.log(e);
    return;
  }
};
