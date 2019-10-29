import * as React from 'react'
import { ExpressionTextNode, getTextContent, replacePlaceholders, MessageBody } from '../Common'
import { StoreContext } from '../KeyValueStore'
import styled from '@emotion/styled'
import { colors, fonts } from '@hedviginsurance/brand'
import { Colors } from '../../colors'

const Title = styled.p`
    color: ${colors.WHITE};
    font-family: ${fonts.CIRCULAR};
    font-weight: bold;
`

const ItemContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`

const Item = styled.span`
    background-color: ${Colors.violet700};
    border-radius: 18px;
    padding: 8px;
    margin: 4px;
`

interface Props {
    title: ExpressionTextNode,
    items: ExpressionTextNode[]
}

export const GroupedResponse: React.FunctionComponent<Props> = (props) => (
    <StoreContext>
        {({store}) => (
            <MessageBody isResponse={true}>
                <Title>{replacePlaceholders(store, getTextContent(store, props.title))}</Title>
                <ItemContainer>{props.items.map(item => (
                    <Item>{replacePlaceholders(store, getTextContent(store, item))}</Item>
                ))}</ItemContainer>
            </MessageBody>
        )}
    </StoreContext>
)