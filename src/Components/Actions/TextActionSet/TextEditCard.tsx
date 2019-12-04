import * as React from "react";
import { Tooltip } from "../../Tooltip";
import { InlineTextAction } from "../InlineActions/InlineTextAction";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand/colors";
import { fonts } from "@hedviginsurance/brand/fonts/index";
import { getCardCountMediaQuery, mediaCardCount } from "../../Utils/cardCount";

const Card = styled.div<{ cardCount: number }>`
  background-color: ${colorsV2.white};
  padding-bottom: 36px;
  position: relative;

  :not(:last-child) {
    margin-right: 1px;
  }

  ${props => mediaCardCount(props.cardCount)`
      padding-top: 0;

      :not(:last-child) {
        margin-bottom: 1px;
        margin-right: 0;
      }
  `}

  @media (max-width: 600px) {
    padding: 0 0 16px 0;
  }
`;

const CardTitle = styled.span<{ pushUp?: boolean; cardCount: number }>`
  font-family: ${fonts.CIRCULAR};
  font-size: 14px;
  font-weight: 500;
  padding-top: 16px;
  padding-left: 16px;
  display: block;

  transition: opacity 200ms, transform 150ms;

  ${props => mediaCardCount(props.cardCount)`
    transform-origin: top left;
    padding-top: 8px;
    padding-bottom: 4px;
    line-height: 1;
    font-size: 12px;

   ${
     props.pushUp
       ? `
          opacity: .5;
          transform: translateY(0);
       `
       : `
          opacity: 0;
          transform: translateY(25%);
       `
   } 
  `}
`;

export class TextEditCard extends React.Component<{
  textAction: any;
  cardCount: number;
  autoFocus: boolean;
  onChange: (value: string) => void;
  value: string;
}> {
  private handleResize = () => {
    this.forceUpdate()
  }

  componentDidMount(): void {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.handleResize)
  }

  render() {
    let { textAction, cardCount, autoFocus, onChange, value } = this.props;
    let isSm = false;
    try {
      isSm = window.matchMedia(getCardCountMediaQuery(cardCount)).matches;
    } catch {
      // noop
    }

    return (
      <Card key={textAction.data.key} cardCount={cardCount}>
        <Tooltip tooltip={textAction.data.tooltip} />
        <CardTitle pushUp={value?.trim()?.length > 0} cardCount={cardCount}>
          {textAction.data.title}
        </CardTitle>
        <InlineTextAction
          autoFocus={autoFocus}
          large={textAction.data.large}
          placeholder={isSm ? textAction.data.title : textAction.data.placeholder}
          strongPlaceholder={isSm}
          exampleValue={textAction.data.placeholder}
          onChange={onChange}
          value={value}
          mask={textAction.data.mask}
        />
      </Card>
    );
  }
}
