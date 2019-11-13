import { passes } from "../Utils/ExpressionsUtil";
import React = require("react");
import styled from "@emotion/styled";
import { colors, fonts } from "@hedviginsurance/brand";

export interface ExpressionTextNode {
  text: string;
  expressions: any;
}

export interface Replacements {
  [key: string]: React.ReactNode;
}

export const TranslationNode: React.SFC = ({ children }) => <>{children}</>;

export const placeholderRegex = new RegExp("({[a-zA-Z0-9_]+})", "g");
export const placeholderKeyRegex = new RegExp("([a-zA-Z0-9_]+)", "g");

export const replacePlaceholders = (
  replacements: Replacements,
  text: string
) => {
  const matches = text.split(placeholderRegex).filter(value => value);

  if (!matches) {
    return [];
  }

  return matches.map((placeholder, index) => {
    if (!placeholderKeyRegex.test(placeholder)) {
      return placeholder;
    }
    const key = placeholder.match(placeholderKeyRegex)![0];

    if (replacements[key]) {
      return <TranslationNode key={index}>{replacements[key]}</TranslationNode>;
    }

    return placeholder;
  });
};

export const getTextContent = (store: any, node: ExpressionTextNode) => {
  if (node.expressions.length > 0) {
    const passableExpressions = node.expressions.filter(expression => {
      return passes(store, expression);
    });

    if (passableExpressions.length == 0) {
      return null;
    }

    return passableExpressions[0].text;
  }

  return node.text;
};

type MessageBodyProps = {
  isResponse: boolean;
};

export const MessageBody = styled.p<MessageBodyProps>`
  display: inline-block;
  background-color: ${(props: MessageBodyProps) =>
    props.isResponse ? colors.PURPLE : colors.WHITE};
  color: ${(props: MessageBodyProps) =>
    props.isResponse ? colors.WHITE : colors.BLACK};
  max-width: 300px;
  padding: 15px;
  border-radius: 20px;
  font-family: ${fonts.CIRCULAR};
  line-height: 25px;
`;