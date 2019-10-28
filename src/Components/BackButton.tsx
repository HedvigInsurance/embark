import * as React from "react"
import styled from "@emotion/styled"
import { fonts, colors } from "@hedviginsurance/brand"
import hexToRgba from 'hex-to-rgba';

import { ArrowUp } from "./Icons/ArrowUp"

const Button = styled.button`
    -webkit-appearance: none;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    outline: 0;
    padding: 10px 20px;
    background-color: ${hexToRgba(colors.WHITE, 0.2)};
    font-family: ${fonts.CIRCULAR};
    color: ${colors.WHITE};
    font-size: 14px;
    transition: transform 250ms;

    :active {
        transform: translateY(2px);
    }
`

const Spacer = styled.span`
    width: 10px;
    display: inline-block;
`

type BackButtonProps = {
    onClick: () => void
}

export const BackButton = (props: BackButtonProps) =>
    <Button onClick={props.onClick}>
        <ArrowUp /><Spacer />Go Back
    </Button>
