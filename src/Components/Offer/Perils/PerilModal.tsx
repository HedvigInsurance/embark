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
  height: 178px;
  background-color: ${colorsV2.lightgray};
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const Title = styled.div`
  font-family: ${fonts.GEOMANIST};
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 2.67px;
  color: ${colorsV2.black};
  text-align: center;
  text-transform: uppercase;
  padding: 28px 0;
  box-sizing: border-box;
`;

const Picker = styled.div`
  width: 100%;
  height: 88px;
  display: flex;
  flex-flow: row;
  margin: 0 -12px;
  overflow-x: scroll;
  padding-bottom: 8px;
  position: relative;
  box-sizing: border-box;
`;

const PickerItem = styled.button`
  width: 100px;
  flex-shrink: 0;
  padding: 8px;
  margin: 0 8px;
  background: none;
  border: none;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  svg {
    width: 42px;
    height: 42px;
  }

  :focus {
    outline: none;
  }
`;

const PickerItemLabel = styled.div`
  font-size: 16px;
  letter-spacing: -0.23px;
  text-align: center;
  white-space: nowrap;
  color: ${colorsV2.darkgray};
`;

interface IndicatorProps {
  currentPeril: number;
}

const Indicator = styled.div<IndicatorProps>`
  position: absolute;
  width: 100px;
  height: 4px;
  bottom: 0;
  left: 0;
  background-color: ${colorsV2.black};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  transition: transform 0.15s ease-in-out;
  ${props =>
    props.currentPeril &&
    `
    transform: translateX(${props.currentPeril * (100 + 16) + 8}px);
  `}
`;

const LeftGradient = styled.div`
  height: 80px;
  width: 100px;
  position: absolute;
  bottom: 8px;
  left: 0;
  background: linear-gradient(
    to right,
    ${colorsV2.lightgray} 15%,
    ${hexToRgba(colorsV2.lightgray, 0)} 100%
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
    ${colorsV2.lightgray} 15%,
    ${hexToRgba(colorsV2.lightgray, 0)} 100%
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

export const PerilModal = (
  props: React.PropsWithChildren<PerilModalProps & ModalProps>
) => {
  return (
    <Modal isVisible={props.isVisible} onClose={props.onClose}>
      <Header>
        <Title>Skyddet</Title>
        <Picker>
          {props.perils.map((peril, perilIndex) => (
            <PickerItem onClick={() => props.setCurrentPeril(perilIndex)}>
              {peril.icon}
              <PickerItemLabel>{peril.title}</PickerItemLabel>
            </PickerItem>
          ))}
          <Indicator currentPeril={props.currentPeril} />
        </Picker>

        <LeftGradient>
          <BackButton>
            <BackArrow />
          </BackButton>
        </LeftGradient>
        <RightGradient>
          <ForwardButton>
            <ForwardArrow />
          </ForwardButton>
        </RightGradient>
      </Header>
      <Content>{props.perils[props.currentPeril].title}</Content>
    </Modal>
  );
};
