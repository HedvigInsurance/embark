import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { CompanyProperties, InsuranceProperties } from "./types";
import { SubHeadingBlack } from "../components";
import { Questionmark } from "../../../Components/Icons/Questionmark";
import { HedvigSymbol } from "../../../Components/Icons/HedvigSymbol";
import { Checkmark } from "../../../Components/Icons/Checkmark";

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
  width: 100%;
  height: 100%;
  padding: 28px;
  box-sizing: border-box;
`;

const ColumnHead = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 58px;
`;

const ColumnRow = styled.div`
  display: flex;
  height: 20px;
  margin-bottom: 26px;
  color: ${colorsV2.gray};
  :last-child {
    margin-bottom: 14px;
  }
`;

const ColumnRowPrimaryContent = styled.span`
  color: ${colorsV2.black};
`;

const InsuranceProperties = styled.div``;

const InsuranceProperty = styled(ColumnRow)`
  font-size: 16px;
  letter-spacing -0.23px;
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
  max-width: 178px;
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

const PrimaryCompanyHead = styled(ColumnHead)`
  display: flex;
  justify-content: center;
`;

const CompanyColumnRow = styled(ColumnRow)`
  font-size: 15px;
  justify-content: center;
  text-align: center;
  letter-spacing: -0.2px;
`;

const OtherCompaniesSection = styled.div`
  width: 100%;
  max-width: 178px;
  height: 100%;
  padding: 25px;
  box-sizing: border-box;
`;

const OtherCompanyHead = styled(ColumnHead)`
  font-weight: 600;
`;

const getProperty = (key: string, value: any): any => {
  if (key === "deductible") {
    return <ColumnRowPrimaryContent>{value} kr</ColumnRowPrimaryContent>;
  }

  if (key === "trustpilotScore") {
    return (
      <>
        <ColumnRowPrimaryContent>{value}</ColumnRowPrimaryContent>av 5
      </>
    );
  }

  return typeof value === "string" ? (
    <ColumnRowPrimaryContent>{value}</ColumnRowPrimaryContent>
  ) : (
    <Checkmark />
  );
};

export const CompareTable = (props: Props) => {
  return (
    <Container>
      <InsurancePropertiesSection>
        <ColumnHead>
          <SubHeadingBlack>Skydd</SubHeadingBlack>
        </ColumnHead>

        <InsuranceProperties>
          {Object.entries(props.insuranceProperties)
            .filter(([key]) => key !== "name")
            .map(([_, property]) => (
              <InsuranceProperty>
                {property.name}
                <InsurancePropertyHelpButton>
                  <Questionmark />
                </InsurancePropertyHelpButton>
              </InsuranceProperty>
            ))}
        </InsuranceProperties>
      </InsurancePropertiesSection>

      <PrimaryCompanySection>
        <PrimaryCompanyHead>
          <HedvigSymbol />
        </PrimaryCompanyHead>

        {Object.entries(props.primaryCompany)
          .filter(([key]) => key !== "name")
          .map(([key, property]) => (
            <CompanyColumnRow>{getProperty(key, property)}</CompanyColumnRow>
          ))}
      </PrimaryCompanySection>

      <OtherCompaniesSection>
        <OtherCompanyHead>{props.otherCompanies[0].name}</OtherCompanyHead>

        {Object.entries(props.otherCompanies[0])
          .filter(([key]) => key !== "name")
          .map(([key, property]) => (
            <CompanyColumnRow>{getProperty(key, property)}</CompanyColumnRow>
          ))}
      </OtherCompaniesSection>
    </Container>
  );
};
