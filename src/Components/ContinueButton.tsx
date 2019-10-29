import * as React from "react"
import { colorsV2, fonts } from "@hedviginsurance/brand"
import styled from "@emotion/styled"

const Button = styled.button`
    border-radius: 28px;
    padding: 16px 20px;
    background-color: ${colorsV2.violet500};
    -webkit-appearance: none;
    border: 0;
    cursor: pointer;
    font-family: ${fonts.CIRCULAR};
    font-weight: 600;
    color: ${colorsV2.white};
    font-size: 15px;
    outline: 0;
    transition: all 250ms;
    
    :hover {
        box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
        transform: translateY(-3px);
    }

    :active {
        transform: translateY(-1.5px);
        background-color: ${colorsV2.violet700};
    }

    ${props => props.disabled && `
        background-color: ${colorsV2.lightgray};
        color: ${colorsV2.gray};

        :hover {
            box-shadow: none;
            transform: translateY(0);
        }

        :active {
            transform: translateY(0);
            background-color: ${colorsV2.violet500};
        }
    `};
`

type ContinueButtonProps = {
    text: String,
    disabled: boolean
}

export const ContinueButton = (props: ContinueButtonProps) =>
    <Button disabled={props.disabled}>
        {props.text}
    </Button>