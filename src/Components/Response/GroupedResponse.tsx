import * as React from 'react'
import {
  evalTemplateString,
  ExpressionTextNode,
  getTextContent,
  MessageAnimation,
  MessageBody,
} from '../Common'
import { Store, StoreContext } from '../KeyValueStore'
import styled from '@emotion/styled'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import { getMultiActionItems } from '../Actions/MultiAction/util'

const Title = styled.p`
  color: ${colorsV3.gray900};
  font-family: ${fonts.FAVORIT};
`

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`

const Item = styled.span`
  display: block;
  color: ${colorsV3.purple500};
  margin: 8px 0;
`

interface Props {
  title: ExpressionTextNode
  items: ExpressionTextNode[]
  each?: {
    key: string
    content: ExpressionTextNode
  }
}

interface EachProps {
  store: Store
  eachKey: string
  content: ExpressionTextNode
}

const Each: React.FunctionComponent<EachProps> = (props) => {
  const items = Object.values(
    getMultiActionItems(props.store, props.eachKey, true),
  )

  return (
    <>
      {items.map((item, index) => (
        <Item key={props.eachKey + index}>
          {evalTemplateString(getTextContent(item, props.content), item)}
        </Item>
      ))}
    </>
  )
}

export const GroupedResponse: React.FunctionComponent<Props> = (props) => {
  const { store } = React.useContext(StoreContext)

  return (
    <MessageAnimation>
      <MessageBody isResponse={true}>
        <Title>
          {evalTemplateString(getTextContent(store, props.title), store)}
        </Title>
        <ItemContainer>
          {props.items.map((item) => (
            <Item key={item.text}>
              {evalTemplateString(getTextContent(store, item), store)}
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
  )
}
