import * as React from "react";
import {
  ExpressionTextNode,
  getTextContent,
  replacePlaceholders,
  MessageBody,
  MessageAnimation
} from "../Common";
import { StoreContext, Store } from "../KeyValueStore";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { getMultiActionItems } from "../Actions/MultiAction/MultiAction";

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
  each?: {
    key: string;
    content: ExpressionTextNode;
  };
}

interface EachProps {
  store: Store;
  eachKey: string;
  content: ExpressionTextNode;
}

const Each: React.FunctionComponent<EachProps> = props => {
  const items = Object.values(getMultiActionItems(props.store, props.eachKey));

  return (
    <>
      {items.map((item, index) => (
        <Item key={props.eachKey + index}>
          {replacePlaceholders(item, getTextContent(item, props.content))}
        </Item>
      ))}
    </>
  );
};

export const GroupedResponse: React.FunctionComponent<Props> = props => {
  const { store } = React.useContext(StoreContext);

  return (
    <MessageAnimation>
      <MessageBody isResponse={true}>
        <Title>
          {replacePlaceholders(store, getTextContent(store, props.title))}
        </Title>
        <ItemContainer>
          {props.items.map(item => (
            <Item key={item.text}>
              {replacePlaceholders(store, getTextContent(store, item))}
            </Item>
          ))}
          {props.each ? (
            <Each
              store={store}
              eachKey={props.each.key}
              content={props.each.content}
            />
          ) : null}
        </ItemContainer>
      </MessageBody>
    </MessageAnimation>
  );
};
