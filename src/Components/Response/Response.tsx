import * as React from "react";
import styled from "@emotion/styled";
import { Message } from "../Message";

const ResponseAlignment = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

type ResponseProps = {
  response: {
    text: string;
    expressions: any;
  };
};

export const Response = (props: ResponseProps) => (
  <ResponseAlignment>
    <Message
      isResponse={true}
      message={{
        delay: 0,
        ...props.response
      }}
    />
  </ResponseAlignment>
);
