import * as React from "react";
import styled from "@emotion/styled";
import { fonts, colorsV3 } from "@hedviginsurance/brand";
import { KeywordsContext } from "../../../KeywordsContext";
import { ArrowLeft } from "../../../Icons/ArrowLeft";

interface Props {
  onClick: () => void;
}

const BackButtonWrapper = styled.button`
  appearance: none;
  cursor: pointer;
  border: 0;
  outline: 0;
  font-family: ${fonts.FAVORIT};
  font-weight: 300;
  font-size: 13px;
  color: ${colorsV3.gray700};
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  transition: color 250ms;
  background: transparent;

  :active {
    color: ${colorsV3.gray900};

    svg {
      & > path {
        stroke: ${colorsV3.gray900};
      }
    }
  }

  svg {
    transform: scale(0.8);

    & > path {
      transition: stroke 250ms;
    }
  }
`;

const BackButtonText = styled.span`
  margin-left: 6px;
  transform: translateY(-0.5px);
`;

export const BackButton: React.FC<Props> = ({ onClick }) => {
  const { externalInsuranceProviderGoBackButton } = React.useContext(
    KeywordsContext
  );

  return (
    <BackButtonWrapper onClick={onClick}>
      <ArrowLeft />
      <BackButtonText>{externalInsuranceProviderGoBackButton}</BackButtonText>
    </BackButtonWrapper>
  );
};
