import * as React from "react";
import {
  ExpressionTextNode,
  getTextContent,
  replacePlaceholders,
  MessageBody
} from "../Common";
import { StoreContext } from "../KeyValueStore";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";

const Title = styled.p`
  color: ${colorsV2.white};
  font-family: ${fonts.CIRCULAR};
  font-weight: bold;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Item = styled.span`
  background-color: ${colorsV2.violet700};
  border-radius: 18px;
  padding: 8px 12px;
  margin: 4px;
`;

interface Props {
  title: ExpressionTextNode;
  items: ExpressionTextNode[];
}

export const GroupedResponse: React.FunctionComponent<Props> = props => {
  const { store } = React.useContext(StoreContext);

  return (
    <MessageBody isResponse={true}>
      <Title>
        {replacePlaceholders(store, getTextContent(store, props.title))}
      </Title>
      <ItemContainer>
        {props.items.map(item => (
          <Item>{replacePlaceholders(store, getTextContent(store, item))}</Item>
        ))}
      </ItemContainer>
    </MessageBody>
  );
};
