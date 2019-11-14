import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { CompanyProperties, InsuranceProperties } from "./types";
import { SubHeadingBlack } from "../components";
import { Questionmark } from "../../../Components/Icons/Questionmark";
import { HedvigSymbol } from "../../../Components/Icons/HedvigSymbol";
import { Checkmark } from "../../../Components/Icons/Checkmark";
import { DownArrow } from "../../../Components/Icons/DownArrow";
import hexToRgba = require("hex-to-rgba");

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
  margin-right: 4px;
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
  padding: 25px 16px;
  box-sizing: border-box;
  position: relative;
`;

interface OtherCompanyHeadProps {
  currentCompany: CompanyProperties | null;
  dropdownIsVisible: boolean;
}

const OtherCompanyHead = styled.button<OtherCompanyHeadProps>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  margin-bottom: 58px;
  font-size: 16px;
  font-weight: 500;
  color: ${props =>
    hexToRgba(colorsV2.black, props.currentCompany !== null ? 1 : 0.2)};
  transition: all 0.1s ease;
  cursor: pointer;

  :focus {
    outline: none;
  }

  > svg {
    width: 14px;
    transition: all 0.1s ease;
    ${props => props.dropdownIsVisible && `transform: rotate(180deg);`}
    ${props => props.dropdownIsVisible && `fill: ${colorsV2.violet500};`}
  }

  :hover {
    color: ${colorsV2.black};

    svg {
      fill: ${colorsV2.violet500};
    }
  }
`;

const Dropdown = styled.div<{ visible: boolean }>`
  background: ${colorsV2.white};
  width: 100%;
  position: absolute;
  height: calc(100% - 61px);
  left: 0;
  top: 60px;
  transition: all 0.2s;
  opacity: ${props => (props.visible ? 1 : 0)};
  padding: 16px;
  box-sizing: border-box;
  border-top: 1px solid ${colorsV2.lightgray};
`;

const DropdownRow = styled.button`
  width: 100%;
  background: none;
  border: none;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  color: ${colorsV2.darkgray};
  margin-bottom: 14px;
  cursor: pointer;

  :focus {
    outline: none;
  }

  :hover {
    color: ${colorsV2.violet500};
  }
`;

const getProperty = (key: string, value: any): any => {
  if (key === "deductible") {
    return <ColumnRowPrimaryContent>{value} kr</ColumnRowPrimaryContent>;
  }

  if (key === "trustpilotScore") {
    return (
      <>
        <ColumnRowPrimaryContent>{value}</ColumnRowPrimaryContent> av 5
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
  const [
    currentCompany,
    setCurrentCompany
  ] = React.useState<CompanyProperties | null>(null);
  const [dropdownIsVisible, setDropdownIsVisible] = React.useState(false);

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
        <OtherCompanyHead
          currentCompany={currentCompany}
          dropdownIsVisible={dropdownIsVisible}
          onClick={() => {
            setDropdownIsVisible(!dropdownIsVisible);
          }}
        >
          {currentCompany !== null ? currentCompany.name : "Välj försäkring"}
          <DownArrow />
        </OtherCompanyHead>
        <Dropdown visible={dropdownIsVisible}>
          {props.otherCompanies.map(company => (
            <DropdownRow>{company.name}</DropdownRow>
          ))}
        </Dropdown>
        {/*
        <OtherCompanyHead>{props.otherCompanies[0].name}</OtherCompanyHead>

        {Object.entries(props.otherCompanies[0])
          .filter(([key]) => key !== "name")
          .map(([key, property]) => (
            <CompanyColumnRow>{getProperty(key, property)}</CompanyColumnRow>
          ))}
          */}
      </OtherCompaniesSection>
    </Container>
  );
};
