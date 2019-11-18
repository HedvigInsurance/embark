import { ApiComponent } from "./apiComponent";
import {
  isPersonalInformationApiComponent,
  handlePersonalInformationApiResult,
  usePersonalInformationQuery
} from "./personalInformation";
import {
  isCreateQuoteApiComponent,
  handleCreateQuoteApiResult,
  useCreateQuoteMutation
} from "./createQuote";
import { useApolloClient } from "@apollo/react-hooks";

const NOOP = () => {};
const EMPTY_OBJECT: any = {}; // We can do better than this in types I think
const NO_API = [NOOP, EMPTY_OBJECT];

export const useApiComponent = (component: ApiComponent, store: any) => {
  const client = useApolloClient();
  const [getPi, piResult] = usePersonalInformationQuery(store);
  const [cq, cqResult] = useCreateQuoteMutation(client, store);

  if (isPersonalInformationApiComponent(component)) {
    return [getPi, piResult];
  }

  if (isCreateQuoteApiComponent(component)) {
    return [cq, cqResult];
  }

  return NO_API;
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
