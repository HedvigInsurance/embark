import * as React from "react";
import { colorsV2 } from "@hedviginsurance/brand";
import styled from "@emotion/styled";

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
`;

type RemoveItemButtonProps = {
  onClick: () => void;
};

export const RemoveItemButton = (props: RemoveItemButtonProps) => (
  <RemoveItemButtonBase onClick={props.onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 50 50"
    >
      <g
        fill="none"
        fill-rule="nonzero"
        filter="url(#a)"
        transform="translate(-211 5)"
      >
        <path
          fill="#9B9BAA"
          d="M227.515 20.485c4.686 4.687 12.284 4.687 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97z"
        />
        <path
          fill="#FFF"
          d="M237.69 12l2.96 2.959a1.196 1.196 0 1 1-1.691 1.69L236 13.692l-2.959 2.959a1.196 1.196 0 1 1-1.69-1.691L234.308 12l-2.959-2.959a1.196 1.196 0 0 1 1.691-1.69L236 10.308l2.959-2.959a1.196 1.196 0 0 1 1.69 1.691L237.692 12z"
        />
      </g>
    </svg>
  </RemoveItemButtonBase>
);
