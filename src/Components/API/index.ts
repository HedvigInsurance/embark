import { ApiComponent } from "./apiComponent";
import {
  isPersonalInformationApiComponent,
  handlePersonalInformationApiResult
} from "./personalInformation";
import {
  isCreateQuoteApiComponent,
  handleCreateQuoteApiResult,
  isUnderwritingLimitsHit,
  isQuote
} from "./createQuote";
import { TApiContext } from "./ApiContext";

export const callApi = async (
  component: ApiComponent | undefined,
  apiContext: TApiContext,
  store,
  setValue,
  changePassage
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

  if (isCreateQuoteApiComponent(component)) {
    const result = await apiContext.createQuote({
      input: {
        firstName: store.firstName,
        lastName: store.lastName,
        currentInsurer: store.currentInsurer,
        ssn: store.personalNumber
      }
    });

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

export const handleErrorOrData = (
  component: ApiComponent,
  error,
  data,
  setValue,
  changePassage
) => {
  if (isPersonalInformationApiComponent(component)) {
    handlePersonalInformationApiResult(
      component,
      error,
      data,
      setValue,
      changePassage
    );
  }

  if (isCreateQuoteApiComponent(component)) {
    handleCreateQuoteApiResult(component, error, data, setValue, changePassage);
  }
};
