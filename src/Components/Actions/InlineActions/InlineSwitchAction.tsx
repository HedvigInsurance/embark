import * as React from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { colorsV3, fonts } from "@hedviginsurance/brand";

type InlineSwitchActionProps = {
  label: string;
  defaultValue: boolean;
  value: boolean;
  onValue: (value: boolean) => void;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const SwitchContainer = styled(motion.span)`
  display: inline-block;
  height: 30px;
  width: 50px;
  border-radius: 15px;
`;

const SwitchNobble = styled(motion.span)`
  display: inline-block;
  height: 28px;
  width: 28px;
  border-radius: 14px;
  background-color: ${colorsV3.white};
`;

const Label = styled.span`
  display: inline-block;
  font-family: ${fonts.FAVORIT};
  font-size: 13px;
  color: ${colorsV3.gray900};
`;

export const InlineSwitchAction = (props: InlineSwitchActionProps) => {
  const value = props.value ? props.value : props.defaultValue;

  return (
    <Container>
      <input type="radio" value={value ? "true" : "false"} hidden />
      <Label>Indraget vatten</Label>
      <SwitchContainer
        animate={{
          backgroundColor: value ? colorsV3.gray700 : colorsV3.gray500
        }}
        onTap={() => {
          props.onValue(!value);
        }}
      >
        <SwitchNobble animate={{ x: value ? 21 : 1, y: 1 }} />
      </SwitchContainer>
    </Container>
  );
};
