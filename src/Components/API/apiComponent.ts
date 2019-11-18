interface Link {
  name: string;
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
}

export type ApiComponent =
  | PersonalInformationApiComponent
  | CreateQuoteApiComponent
  | undefined;
