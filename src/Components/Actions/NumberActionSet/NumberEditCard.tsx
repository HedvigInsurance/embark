import * as React from "react";
import { Tooltip } from "../../Tooltip";
import { InlineNumberAction } from "../InlineActions/InlineNumberAction";
import styled from "@emotion/styled";
import { colorsV2 } from "@hedviginsurance/brand/colors";
import { fonts } from "@hedviginsurance/brand/fonts/index";
import {
  CARD_COUNT_BASE_BP_SM,
  getCardCountMediaQuery,
  mediaCardCount
} from "../../Utils/cardCount";

const Card = styled.form<{
  cardCount: number;
}>`
  position: relative;
  background-color: ${colorsV2.white};
  display: inline-block;
  max-width: 100%;
  width: 200px;

  :not(:last-of-type) {
    margin-right: 1px;
  }

  ${props => mediaCardCount(props.cardCount, CARD_COUNT_BASE_BP_SM)`
    padding-bottom: 16px;
    width: 100%;
    
    :not(:last-of-type) {
      margin-right: 0;
      margin-bottom: 1px;
    }
  `}
`;

const CardTitle = styled.span<{ cardCount: number; pushUp?: boolean }>`
  font-family: ${fonts.CIRCULAR};
  font-size: 14px;
  font-weight: 500;
  padding-top: 15px;
  padding-left: 20px;
  display: inline-block;
  transition: opacity 200ms, transform 150ms;
  padding-bottom: 16px;

  ${props => mediaCardCount(props.cardCount, CARD_COUNT_BASE_BP_SM)`
    transform-origin: top left;
    padding: 8px 0 4px 16px; 
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

export class NumberEditCard extends React.Component<{
  onSubmit: () => void;
  action: any;
  value: string;
  onChange: (value: string) => void;
  cardCount: number;
  inputRef: React.RefObject<HTMLInputElement>;
}> {
  private handleResize = () => {
    this.forceUpdate();
  };

  componentDidMount(): void {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    let isSm = false;
    try {
      isSm = window.matchMedia(
        getCardCountMediaQuery(this.props.cardCount, CARD_COUNT_BASE_BP_SM)
      ).matches;
    } catch {
      // noop
    }

    return (
      <Card
        onSubmit={e => {
          e.preventDefault();
          this.props.onSubmit();
        }}
        cardCount={this.props.cardCount}
      >
        <Tooltip tooltip={this.props.action.data.tooltip} />
        <CardTitle
          cardCount={this.props.cardCount}
          pushUp={this.props.value?.trim()?.length > 0}
        >
          {this.props.action.data.title}
        </CardTitle>
        <InlineNumberAction
          inputRef={this.props.inputRef}
          placeholder={
            isSm
              ? this.props.action.data.title
              : this.props.action.data.placeholder
          }
          unit={this.props.action.data.unit}
          value={this.props.value}
          onValue={this.props.onChange}
          isSm={isSm}
        />
      </Card>
    );
  }
}
