import * as React from "react";
import styled from "@emotion/styled";
import {
  getTextContent,
  replacePlaceholders,
  MessageBody,
  MessageAnimation
} from "./Common";
import { StoreContext } from "./KeyValueStore";
import { Expression } from "../Utils/ExpressionsUtil";

interface Message {
  expressions: Expression[];
  text: string;
}

type MessageProps = {
  message: Message;
  isResponse: boolean;
};

const MessageContainer = styled.div`
  padding-bottom: 5px;
`;

export const TranslationNode: React.SFC = ({ children }) => <>{children}</>;

export const Message = (props: MessageProps) => {
  const { store } = React.useContext(StoreContext);
  const text = getTextContent(store, props.message);
  if (!text) {
    return null;
  }
  return (
    <MessageContainer>
      <MessageAnimation>
        <MessageBody isResponse={props.isResponse}>
          {replacePlaceholders(store, text)}
        </MessageBody>
      </MessageAnimation>
    </MessageContainer>
  );
};
