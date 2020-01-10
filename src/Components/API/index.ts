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
import uuid from "uuid";

export const callApi = async (
  component: ApiComponent,
  apiContext: TApiContext,
  store: Store,
  setValue: (key: string, value: string) => void,
  changePassage: (name: string) => void
) => {
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
