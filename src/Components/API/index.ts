import { ApiComponent } from "./apiComponent";
import { isPersonalInformationApiComponent } from "./personalInformation";
import {
  isCreateQuoteApiComponent,
  isUnderwritingLimitsHit,
  isQuote,
  Variables as CQVariables,
  ApartmentType
} from "./createQuote";
import { TApiContext } from "./ApiContext";
import { Store } from "../KeyValueStore";
import { getMultiActionItems } from "../Actions/MultiAction/MultiAction";
import { isHouseInformationComponent } from "./houseInformation";

export const callApi = async (
  component: ApiComponent,
  apiContext: TApiContext,
  store: Store,
  setValue: (key: string, value: string) => void,
  changePassage: (name: string) => void
) => {
  if (isPersonalInformationApiComponent(component)) {
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
  }

  if (isHouseInformationComponent(component)) {
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
  }

  if (isCreateQuoteApiComponent(component)) {
    let variables: CQVariables = {
      input: {
        firstName: store.firstName,
        lastName: store.lastName,
        ssn: store.personalNumber,
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
        ancillarySpace: Number(store.ancillarySpace),
        extraBuildings: Object.values(
          getMultiActionItems(store, "extraBuildings")
        ) as any
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
  }
};
