import * as React from "react";
import styled from "@emotion/styled";
import { fonts, colors } from "@hedviginsurance/brand";
import { motion } from "framer-motion";

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

const TooltipIcon = styled(motion.div)`
  background-color: ${colors.LIGHT_GRAY};
  width: 28px;
  height: 28px;
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  text-align: center;
  transition: all 250ms;

  .fillColor {
    transition: all 250ms;
  }

  :hover {
    background-color: ${colors.PURPLE};
    .fillColor {
      fill: ${colors.WHITE};
    }
  }

  svg {
    margin: 0 auto;
  }
`;

const TooltipContainer = styled(motion.div)`
  position: absolute;
  top: 0px;
  right: 0px;
`;

const Tooltip = styled.div`
  background-color: ${colors.PURPLE};
  border-radius: 10px;
  color: ${colors.WHITE};
  display: flex;
  align-items: center;
  text-align: center;
  padding: 10px;
  font-family: ${fonts.CIRCULAR};
  max-width: 150px;
  min-width: 35px;
  text-align: center;
  justify-content: center;
  transform: translateX(calc(50% - 24px));

  :after {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-top-color: ${colors.PURPLE};
    border-width: 7px;
    margin-left: -7px;
  }
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
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <Container
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={props.onClick}
    >
      {props.tooltip && (
        <>
          <TooltipContainer
            initial="hidden"
            animate={showTooltip ? "visible" : "hidden"}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 125
            }}
            variants={{
              visible: {
                opacity: 1,
                y: "-105%"
              },
              hidden: {
                opacity: 0,
                y: "-90%"
              }
            }}
          >
            <Tooltip>{props.tooltip.description}</Tooltip>
          </TooltipContainer>
          <TooltipIcon
            onHoverStart={() => {
              setShowTooltip(true);
            }}
            onHoverEnd={() => setShowTooltip(false)}
          >
            <svg width="8px" height="12px" viewBox="0 0 8 12" version="1.1">
              <g
                id="Symbols"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  className="fillColor"
                  transform="translate(-8.000000, -6.000000)"
                  fill="#9B9BAA"
                >
                  <path
                    d="M12.5781938,14.4377565 C12.561674,14.3392613 12.561674,14.2571819 12.561674,14.2243502 C12.561674,13.5841313 12.842511,13.0424077 13.3876652,12.6648427 L14.0980176,12.1723666 C15.0561674,11.499316 15.75,10.5800274 15.75,9.28317373 C15.75,7.60875513 14.4284141,6 11.9834802,6 C9.48898678,6 8.25,7.78932969 8.25,9.43091655 C8.25,9.69357045 8.28303965,9.95622435 8.34911894,10.1860465 L10.215859,10.3173735 C10.1497797,10.1367989 10.1167401,9.8248974 10.1167401,9.57865937 C10.1167401,8.64295486 10.7610132,7.70725034 11.9834802,7.70725034 C13.1894273,7.70725034 13.7676211,8.51162791 13.7676211,9.36525308 C13.7676211,9.92339261 13.5363436,10.3994528 12.9911894,10.7934337 L12.2312775,11.3351573 C11.2731278,12.0246238 10.8931718,12.8290014 10.8931718,13.8139535 C10.8931718,14.0437756 10.9096916,14.2243502 10.9262115,14.4377565 L12.5781938,14.4377565 Z M10.5627753,16.8016416 C10.5627753,17.4582763 11.0914097,18 11.7687225,18 C12.4295154,18 12.9746696,17.4582763 12.9746696,16.8016416 C12.9746696,16.1450068 12.4295154,15.5868673 11.7687225,15.5868673 C11.0914097,15.5868673 10.5627753,16.1450068 10.5627753,16.8016416 Z"
                    id="?"
                  />
                </g>
              </g>
            </svg>
          </TooltipIcon>
        </>
      )}
      <Content>
        <Label>{props.label}</Label>
        <SelectLabel isHovering={isHovering}>Select</SelectLabel>
      </Content>
    </Container>
  );
};
