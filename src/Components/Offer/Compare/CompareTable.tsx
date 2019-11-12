import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { CompanyProperties, InsuranceProperties } from "./types";
import { SubHeadingBlack } from "../components";
import { Questionmark } from "../../../Components/Icons/Questionmark";

interface Props {
  insuranceProperties: InsuranceProperties;
  primaryCompany: CompanyProperties;
  otherCompanies: CompanyProperties[];
}

const Container = styled.div`
  width: 100%;
  border-radius: 4px;
  display: flex;
  flex-flow: row;
  background-color: ${colorsV2.white};
  border: 1px solid ${colorsV2.lightgray};
`;

const InsurancePropertiesSection = styled.div`
  width: 300px;
  flex-shrink: 0;
  height: 100%;
  padding: 25px;
  box-sizing: border-box;
`;

const InsuranceProperties = styled.div`
  margin-top: 58px;
`;

const InsurancePropety = styled.div`
  font-size: 16px;
  letter-spacing -0.23px;
  color: ${colorsV2.gray};
  margin-bottom: 24px;
  display: flex;
  flex-flow: row;
  align-items: center;
`;

const InsurancePropertyHelpButton = styled.button`
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colorsV2.lightgray};
  border-radius: 50%;
  cursor: pointer;
  border: none;
  margin-left: 12px;

  :focus {
    outline: none;
  }

  svg {
    width: 6px;
  }
`;

const PrimaryCompanySection = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  box-sizing: border-box;
  background-color: ${colorsV2.lightgray};
  position: relative;

  :before,
  :after {
    content: "";
    position: absolute;
    left: 0;
    background-color: ${colorsV2.lightgray};
    width: 100%;
    height: 10px;
  }

  :before {
    top: -10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  :after {
    bottom: -10px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const OtherCompaniesSection = styled.div`
  width: 100%;
  height: 100%;
  padding: 25px;
  box-sizing: border-box;
`;

export const CompareTable = (props: Props) => {
  return (
    <Container>
      <InsurancePropertiesSection>
        <SubHeadingBlack>Skydd</SubHeadingBlack>
        <InsuranceProperties>
          {Object.entries(props.insuranceProperties).map(([key, property]) => (
            <InsurancePropety>
              {property.name}
              <InsurancePropertyHelpButton>
                <Questionmark />
              </InsurancePropertyHelpButton>
            </InsurancePropety>
          ))}
        </InsuranceProperties>
      </InsurancePropertiesSection>

      <PrimaryCompanySection></PrimaryCompanySection>
      <OtherCompaniesSection></OtherCompaniesSection>
    </Container>
  );
};
