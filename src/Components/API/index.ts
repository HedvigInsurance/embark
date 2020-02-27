import { ApiComponent } from "./apiComponent";
import { isPersonalInformationApiComponent } from "./personalInformation";
import {
  isCreateQuoteApiComponent,
  isUnderwritingLimitsHit,
  isQuote,
  Variables as CQVariables,
  ApartmentType,
  ExtraBuildingInput
} from "./createQuote";
import { TApiContext } from "./ApiContext";
import { Store } from "../KeyValueStore";
import { getMultiActionItems } from "../Actions/MultiAction/util";
import { isHouseInformationComponent } from "./houseInformation";
import { isGraphqlApi } from "./graphql";
import uuid from "uuid";
import get from "lodash.get";
import { GraphQLError, ExecutionResult } from "graphql";

export const callApi = async (
  component: ApiComponent,
  apiContext: TApiContext,
  store: Store,
  setValue: (key: string, value: string) => void,
  changePassage: (name: string) => void
) => {
  if (isGraphqlApi(component)) {
    try {
      const variables = component.data.variables.reduce((curr, variable) => {
        switch (variable.as) {
          case "string":
            return { ...curr, [variable.key]: String(store[variable.from]) };
          case "int":
            return { ...curr, [variable.key]: parseInt(store[variable.from]) };
        }

        return { ...curr, [variable.key]: store[variable.from] };
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
  }

  if (isPersonalInformationApiComponent(component)) {
    try {
      const result = await apiContext.personalInformationApi(
        store.personalNumber
      );
      if (result instanceof Error) {
        changePassage(component.data.error.name);
        return;
      }
      if (!result.personalInformation) {
        changePassage(component.data.noMatch.name);
        return;
      }

      Object.entries(result.personalInformation).forEach(([key, value]) =>
        setValue(key, value)
      );
      changePassage(component.data.match.name);
      return;
    } catch (e) {
      changePassage(component.data.error.name);
      return;
    }
  }

  if (isHouseInformationComponent(component)) {
    try {
      const result = await apiContext.houseInformation({
        input: {
          streetAddress: store.streetAddress,
          postalNumber: store.postalNumber
        }
      });

      if (result instanceof Error) {
        changePassage(component.data.error.name);
        return;
      }

      if (!result.houseInformation) {
        changePassage(component.data.noMatch.name);
        return;
      }

      Object.entries(result.houseInformation).forEach(([key, value]) =>
        setValue(key, String(value))
      );
      changePassage(component.data.match.name);
      return;
    } catch (e) {
      changePassage(component.data.error.name);
      return;
    }
  }

  if (isCreateQuoteApiComponent(component)) {
    try {
      let variables: CQVariables = {
        input: {
          id: uuid.v1(),
          firstName: store.firstName,
          lastName: store.lastName,
          ssn: store.personalNumber,
          dataCollectionId: store.dataCollectionId,
          email: store.email,
          currentInsurer: store.currentInsurer
        }
      };

      if (store.homeType === "apartment") {
        variables.input.apartment = {
          street: store.streetAddress,
          zipCode: store.postalNumber,
          householdSize: Number(store.householdSize),
          livingSpace: Number(store.livingSpace),
          type: store.apartmentType as ApartmentType
        };
      }

      if (store.homeType === "house") {
        variables.input.house = {
          street: store.streetAddress,
          zipCode: store.postalNumber,
          householdSize: Number(store.householdSize),
          livingSpace: Number(store.livingSpace),
          ancillarySpace: Number(store.ancillaryArea),
          yearOfConstruction: Number(store.yearOfConstruction),
          numberOfBathrooms: Number(store.numberOfBathrooms),
          isSubleted: Boolean(store.isSubleted),
          extraBuildings: Object.values(
            getMultiActionItems<ExtraBuildingInput>(store, "extraBuildings")
          ).map<ExtraBuildingInput>(item => ({
            area: Number(item.area),
            type: item.type,
            hasWaterConnected: Boolean(item.hasWaterConnected)
          }))
        };
      }

      const result = await apiContext.createQuote(variables);

      if (result instanceof Error) {
        changePassage(component.data.error.name);
        return;
      }

      if (isUnderwritingLimitsHit(result.createQuote)) {
        changePassage(component.data.uwlimits.name);
        return;
      }

      if (isQuote(result.createQuote)) {
        changePassage(component.data.success.name);
        return;
      }

      changePassage(component.data.error.name);
      return;
    } catch (e) {
      changePassage(component.data.error.name);
      return;
    }
  }
};
