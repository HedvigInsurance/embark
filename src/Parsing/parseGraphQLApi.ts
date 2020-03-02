import { getFirstLevelNodes, parseLinks } from "./utils";

const parseVariables = (element: Element) => {
  const key = element.getAttribute("key");
  const from = element.getAttribute("from");
  const as = element.getAttribute("as");

  return {
    key,
    from,
    as
  };
};

const parseErrors = (element: Element) => {
  const contains = element.getAttribute("contains");
  const next = element.getAttribute("next");
  const nextLinks = parseLinks(next || "");

  return {
    contains,
    next: nextLinks && nextLinks[0]
  };
};

const parseResults = (element: Element) => {
  const key = element.getAttribute("key");
  const as = element.getAttribute("as");

  return {
    key,
    as
  };
};

export const parseGraphQLApi = (
  element: Element,
  allowNestedChildren: boolean = true
) => {
  const graphQLApi = element.getElementsByTagName("graphqlapi")[0];

  if (graphQLApi) {
    if (
      allowNestedChildren == false &&
      !getFirstLevelNodes(element).includes(graphQLApi)
    ) {
      return null;
    }

    const queryElement = graphQLApi.getElementsByTagName("query")[0];

    if (queryElement) {
      const query = queryElement.textContent;
      const nextLinks = parseLinks(graphQLApi.getAttribute("next") || "");
      const variables = Array.from(
        graphQLApi.getElementsByTagName("variable")
      ).map(parseVariables);
      const errors = Array.from(graphQLApi.getElementsByTagName("error")).map(
        parseErrors
      );
      const results = Array.from(graphQLApi.getElementsByTagName("result")).map(
        parseResults
      );

      return {
        __typename: "EmbarkGraphQLApiQuery",
        component: "GraphQLApi",
        data: {
          next: nextLinks && nextLinks[0],
          query,
          variables,
          errors,
          results
        }
      };
    }

    const mutationElement = graphQLApi.getElementsByTagName("mutation")[0];

    const mutation = mutationElement.textContent;
    const nextLinks = parseLinks(graphQLApi.getAttribute("next") || "");
    const variables = Array.from(
      graphQLApi.getElementsByTagName("variable")
    ).map(parseVariables);
    const errors = Array.from(graphQLApi.getElementsByTagName("error")).map(
      parseErrors
    );
    const results = Array.from(graphQLApi.getElementsByTagName("result")).map(
      parseResults
    );

    return {
      __typename: "EmbarkGraphQLApiMutation",
      component: "GraphQLApi",
      data: {
        next: nextLinks && nextLinks[0],
        mutation,
        variables,
        errors,
        results
      }
    };
  }

  return null;
};
