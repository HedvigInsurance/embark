import { MockedResponse } from "@apollo/react-testing";
import personalInformationQuery from "./Components/API/personalInformation.graphql";

const AN_UUID = "6955dd62-4994-4677-a174-7eab9a9a7b92";

const personalInformationQueryMocks: MockedResponse[] = [
  {
    request: {
      query: personalInformationQuery,
      variables: {
        input: {
          personalNumber: "1212121212"
        }
      }
    },
    result: {
      data: {
        personalInformation: {
          firstName: "Test",
          lastName: "Testerson",
          streetAddress: "Testvägen 1",
          city: "Tensta",
          postalNumber: "12345"
        }
      }
    },
    delay: 2000
  },
  {
    request: {
      query: personalInformationQuery,
      variables: {
        input: {
          personalNumber: "1111111111"
        }
      }
    },
    result: {
      data: {
        personalInformation: null
      }
    },
    delay: 2000
  }
];

export const mocks = [...personalInformationQueryMocks];
