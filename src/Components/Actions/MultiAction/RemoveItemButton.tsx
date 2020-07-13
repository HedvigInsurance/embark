import * as React from 'react'
import { colorsV2 } from '@hedviginsurance/brand'
import styled from '@emotion/styled'

const RemoveItemButtonBase = styled.div`
  border: 0;
  -webkit-appearance: none;
  background-color: ${colorsV2.gray};
  outline: 0;
  flex-grow: 1;
  flex-basis: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transition: transform 250ms, box-shadow 250ms, background-color 250ms;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;

  :hover {
    background-color: ${colorsV2.darkgray};
  }
`

type RemoveItemButtonProps = {
  onClick: () => void
}

export const RemoveItemButton = (props: RemoveItemButtonProps) => (
  <RemoveItemButtonBase onClick={props.onClick}>
    <svg
      width="10px"
      height="10px"
      viewBox="0 0 13 13"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          x="-16.8%"
          y="-17.8%"
          width="133.6%"
          height="135.7%"
          filterUnits="objectBoundingBox"
          id="filter-1"
        >
          <feOffset
            dx="0"
            dy="8"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          />
          <feGaussianBlur
            stdDeviation="6.5"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.174579327 0"
            type="matrix"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          />
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g
          transform="translate(-330.000000, -1627.000000)"
          fill="#FFFFFF"
          fillRule="nonzero"
        >
          <g
            filter="url(#filter-1)"
            transform="translate(102.000000, 1627.000000)"
          >
            <g>
              <g transform="translate(228.000000, 0.000000)">
                <path
                  d="M8.52719712,6.625 L11.8560421,9.95384496 C12.3813193,10.4791222 12.3813193,11.3307648 11.8560421,11.8560421 C11.3307648,12.3813193 10.4791222,12.3813193 9.95384496,11.8560421 L6.625,8.52719712 L3.29615504,11.8560421 C2.77087781,12.3813193 1.91923515,12.3813193 1.39395792,11.8560421 C0.868680692,11.3307648 0.868680692,10.4791222 1.39395792,9.95384496 L4.72280288,6.625 L1.39395792,3.29615504 C0.868680692,2.77087781 0.868680692,1.91923515 1.39395792,1.39395792 C1.91923515,0.868680692 2.77087781,0.868680692 3.29615504,1.39395792 L6.625,4.72280288 L9.95384496,1.39395792 C10.4791222,0.868680692 11.3307648,0.868680692 11.8560421,1.39395792 C12.3813193,1.91923515 12.3813193,2.77087781 11.8560421,3.29615504 L8.52719712,6.625 Z"
                  id="Path"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </RemoveItemButtonBase>
)
