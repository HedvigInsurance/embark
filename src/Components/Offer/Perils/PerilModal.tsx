import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { Modal, ModalProps } from "../../Modal";
import { Peril } from "./index";
import hexToRgba = require("hex-to-rgba");
import { BackArrow } from "../../../Components/Icons/BackArrow";
import { ForwardArrow } from "../../../Components/Icons/ForwardArrow";

interface PerilModalProps {
  perils: Peril[];
  currentPeril: number;
  setCurrentPeril: (perilIndex: number) => void;
}

const Header = styled.div`
  width: 100%;
  height: 140px;
  background-color: ${colorsV2.white};
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 2px;
`;

const Picker = styled.div`
  width: 100%;
  height: 88px;
  display: flex;
  flex-flow: row;
  margin: 0 -12px;
  overflow-x: scroll;
  position: relative;
  box-sizing: border-box;
`;

const PickerItem = styled.button`
  width: 100px;
  flex-shrink: 0;
  padding: 8px 8px 10px 8px;
  margin: 0 8px;
  background: none;
  border: none;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  svg {
    width: 44px;
    height: 44px;
  }

  :focus {
    outline: none;
  }
`;

const PickerItemLabel = styled.div`
  font-size: 15px;
  letter-spacing: -0.23px;
  text-align: center;
  white-space: nowrap;
  color: ${colorsV2.darkgray};
`;

interface PerilItemsContainerProps {
  currentPeril: number;
  transition: boolean;
}

const PerilItemsContainer = styled.div<PerilItemsContainerProps>`
  position: relative;
  height: 88px;
  display: flex;
  ${props => props.transition && `transition: all 0.25s ease-in-out;`}

  ${props =>
    `transform: translateX(${
      props.currentPeril !== 0
        ? `calc(-33.3333333333333% - ${(props.currentPeril - 12 - 1) *
            (100 + 16) +
            8}px)`
        : `calc(-33.3333333333333% + 108px)`
    });`}
`;

const Indicator = styled.div`
  position: absolute;
  width: 100px;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: ${colorsV2.black};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  transition: transform 0.15s ease-in-out;
  left: 116px;
`;

const LeftGradient = styled.div`
  height: 80px;
  width: 100px;
  position: absolute;
  bottom: 8px;
  left: 0;
  background: linear-gradient(
    to right,
    ${colorsV2.white} 15%,
    ${hexToRgba(colorsV2.white, 0)} 100%
  );
  display: flex;
  align-items: center;
`;

const BackButton = styled.button`
  margin-left: 10px;
  cursor: pointer;
  background: none;
  border: none;
  :focus {
    outline: none;
  }
`;

const RightGradient = styled.div`
  height: 80px;
  width: 100px;
  position: absolute;
  right: 0;
  bottom: 8px;
  background: linear-gradient(
    to left,
    ${colorsV2.white} 15%,
    ${hexToRgba(colorsV2.white, 0)} 100%
  );
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ForwardButton = styled.button`
  margin-right: 10px;
  cursor: pointer;
  background: none;
  border: none;
  :focus {
    outline: none;
  }
`;

const Content = styled.div`
  padding: 24px;
`;

const createPerilItems = (
  perils: Peril[],
  setCurrentPeril: (index: number) => void,
  actionsAllowed: boolean
) => {
  let items = [];
  for (let i = 0; i < perils.length * 3; i++) {
    const index = i % perils.length;
    items.push(
      <PickerItem onClick={() => actionsAllowed && setCurrentPeril(i)}>
        {perils[index].icon}
        <PickerItemLabel>{perils[index].title}</PickerItemLabel>
      </PickerItem>
    );
  }
  return items;
};

export const PerilModal = (
  props: React.PropsWithChildren<PerilModalProps & ModalProps>
) => {
  const [transitionEnabled, setTransitionEnabled] = React.useState(true);
  const [actionsAllowed, setActionsAllowed] = React.useState(true);

  React.useEffect(() => {
    const isBelowBoundary = props.currentPeril < props.perils.length;
    const isAboveBoundary = props.currentPeril > props.perils.length * 2;

    if (isBelowBoundary || isAboveBoundary) {
      setTimeout(() => {
        setTransitionEnabled(false);
        props.setCurrentPeril(
          props.currentPeril + (isBelowBoundary ? 1 : -1) * props.perils.length
        );

        setTimeout(() => setTransitionEnabled(true), 250);
      }, 250);
    }

    setActionsAllowed(false);

    setTimeout(() => {
      setActionsAllowed(true);
    }, 500);
  }, [props.currentPeril]);

  return (
    <Modal isVisible={props.isVisible} onClose={props.onClose}>
      <Header>
        <Picker>
          <PerilItemsContainer
            currentPeril={props.currentPeril}
            transition={transitionEnabled}
          >
            {createPerilItems(
              props.perils,
              props.setCurrentPeril,
              actionsAllowed
            )}
          </PerilItemsContainer>
          <Indicator />
        </Picker>

        <LeftGradient>
          <BackButton
            onClick={() => {
              actionsAllowed && props.setCurrentPeril(props.currentPeril - 1);
            }}
          >
            <BackArrow />
          </BackButton>
        </LeftGradient>
        <RightGradient>
          <ForwardButton
            onClick={() => {
              actionsAllowed && props.setCurrentPeril(props.currentPeril + 1);
            }}
          >
            <ForwardArrow />
          </ForwardButton>
        </RightGradient>
      </Header>
      <Content>
        {props.perils[props.currentPeril % props.perils.length].title}
      </Content>
    </Modal>
  );
};
