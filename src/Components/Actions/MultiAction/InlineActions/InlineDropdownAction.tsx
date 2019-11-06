import * as React from "react";
import { StoreContext } from "../../../KeyValueStore";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";

type DropdownActionProps = {
  label: string;
  options: [
    {
      value: string;
      text: string;
    }
  ];
  value: string;
  onValue: (value: string) => void;
};

const Select = styled.select`
  -webkit-appearance: none;
  outline: 0;
  width: 100%;
  font-family: ${fonts.CIRCULAR};
  background-color: transparent;
  padding: 5px;
  border: 0;
  font-size: 14px;
  font-weight: 500;
  padding: 16px 20px;
  color: ${colorsV2.violet500};
  cursor: pointer;

  :not(:valid) {
    color: ${colorsV2.gray};
  }
`;

const Container = styled.div`
  position: relative;
`;

const Arrow = styled.svg`
  right: 20px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

export const InlineDropdownAction = (props: DropdownActionProps) => (
  <Container>
    <Select
      required
      value={props.value}
      onChange={e => {
        props.onValue(e.target.value);
      }}
    >
      <option value="" disabled selected>
        {props.label}
      </option>
      {props.options.map(option => (
        <option value={option.value}>{option.text}</option>
      ))}
    </Select>
    <Arrow width="18px" height="13px" viewBox="0 0 14 9" version="1.1">
      <defs>
        <filter
          x="-16.3%"
          y="-17.5%"
          width="132.7%"
          height="134.9%"
          filterUnits="objectBoundingBox"
          id="filter-1"
        >
          <feOffset
            dx="0"
            dy="8"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          ></feOffset>
          <feGaussianBlur
            stdDeviation="6.5"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          ></feGaussianBlur>
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.174579327 0"
            type="matrix"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          ></feColorMatrix>
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
            <feMergeNode in="SourceGraphic"></feMergeNode>
          </feMerge>
        </filter>
      </defs>
      <g
        id="Component-Sheet"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linejoin="round"
      >
        <g
          id="Web-Onboarding-#Components-#Desktop"
          transform="translate(-584.000000, -895.000000)"
          fill-rule="nonzero"
          stroke="#651EFF"
          stroke-width="1.19999993"
        >
          <g
            id="Group"
            filter="url(#filter-1)"
            transform="translate(375.000000, 866.000000)"
          >
            <g
              id="Desktop/Add-Building"
              transform="translate(0.000000, 8.000000)"
            >
              <g id="Desktop/Option">
                <g id="Group-2" transform="translate(0.000000, 16.000000)">
                  <polygon
                    id="Path-2"
                    transform="translate(216.000000, 9.500000) rotate(-90.000000) translate(-216.000000, -9.500000) "
                    points="219 4.41578715 218.578294 4 213 9.5 218.578294 15 219 14.5842129 213.843412 9.5"
                  ></polygon>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </Arrow>
  </Container>
);
