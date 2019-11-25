import * as React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import {
  getTextContent,
  replacePlaceholders,
  MessageBody,
  MessageAnimation
} from "./Common";
import { StoreContext } from "./KeyValueStore";

type MessageProps = {
  message: any;
  isResponse: boolean;
};

const MessageContainer = styled.div`
  padding-bottom: 5px;
`;

interface Replacements {
  [key: string]: React.ReactNode;
}

export const TranslationNode: React.SFC = ({ children }) => <>{children}</>;

export const Message = (props: MessageProps) => {
  return (
    <StoreContext.Consumer>
      {({ store }) => {
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
      }}
    </StoreContext.Consumer>
  );
};
