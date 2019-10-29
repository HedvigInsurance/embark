import * as React from "react";
import styled from "@emotion/styled";
import { fonts, colors } from "@hedviginsurance/brand";
import { Tooltip } from "../../Tooltip"

const Container = styled.button`
  display: inline-block;
  position: relative;
  text-align: center;
  background: ${colors.WHITE};
  padding: 20px;
  margin: 10px;
  -webkit-appearance: none;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  outline: 0;
  flex-grow: 1;
  flex-basis: 0;
  transition: all 350ms;
  max-width: 225px;

  :hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
  }

  :active {
    transform: translateY(-1.5px);
  }
`;

const Label = styled.span`
  font-family: ${fonts.CIRCULAR};
  font-size: 18px;
  font-weight: 800;
`;


const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

type SelectLabelProps = {
  isHovering: boolean;
};

const SelectLabel = styled.span<SelectLabelProps>`
  display: inline-block;
  background-color: ${colors.LIGHT_GRAY};
  padding: 5px 12px;
  border-radius: 12.5px;
  margin-top: 8px;
  font-family: ${fonts.CIRCULAR};
  font-size: 12px;
  font-weight: 400;
  color: ${colors.OFF_BLACK};
  transition: all 350ms;
  ${(props: SelectLabelProps) =>
    props.isHovering &&
    `
        background-color: ${colors.PURPLE};
        color: ${colors.WHITE};
    `};
`;

type SelectOptionProps = {
  label: String;
  tooltip: {
    title: string;
    description: string;
  } | null;
  onClick: () => void;
};

export const SelectOption = (props: SelectOptionProps) => {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <Container
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={props.onClick}
    >
      <Tooltip tooltip={props.tooltip} />
      <Content>
        <Label>{props.label}</Label>
        <SelectLabel isHovering={isHovering}>Select</SelectLabel>
      </Content>
    </Container>
  );
};
