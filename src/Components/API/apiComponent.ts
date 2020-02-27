interface Link {
  name: string;
}

export interface GraphQLVariable {
  key: string;
  from: string;
  as: string;
}

export interface GraphQLError {
  contains?: string;
  next: Link;
}

export interface GraphQLResult {
  key: string;
  as: string;
}

export interface GraphQLApiComponent {
  component: "GraphQLApi";
  data: {
    next: Link;
    query?: string;
    mutation?: string;
    variables: [GraphQLVariable];
    errors: [GraphQLError];
    results: [GraphQLResult];
  };
}

export interface PersonalInformationApiComponent {
  component: "PersonalInformationApi";
  data: {
    match: Link;
    noMatch: Link;
    error: Link;
  };
}

export interface CreateQuoteApiComponent {
  component: "CreateQuoteApi";
  data: {
    uwlimits: Link;
    success: Link;
    error: Link;
  };
}

export interface HouseInformationApiComponent {
  component: "HouseInformationApi";
  data: {
    match: Link;
    noMatch: Link;
    error: Link;
  };
}

export type ApiComponent =
  | PersonalInformationApiComponent
  | CreateQuoteApiComponent
  | HouseInformationApiComponent
  | GraphQLApiComponent
  | undefined;
