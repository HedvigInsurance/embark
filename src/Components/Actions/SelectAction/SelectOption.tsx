import * as React from "react"
import styled from "@emotion/styled"
import { fonts, colors } from "@hedviginsurance/brand"
import { Tooltip } from "../../Tooltip"

const Container = styled.button`
    display: inline-block;
    position: relative;
    text-align: center;
    background: ${colors.WHITE};
    padding: 20px;
    margin: 10px;
    -webkit-appearance: none;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    outline: 0;
    width: 175px;
    height: 100px;
`

const Label = styled.span`
    font-family: ${fonts.CIRCULAR};
    font-size: 18px;
`

type SelectOptionProps = {
    label: String,
    tooltip: {
        title: string,
        description: string
    } | null,
    onClick: () => void
}

export const SelectOption = (props: SelectOptionProps) => {

    return (
        <Container onClick={props.onClick}>
            <Tooltip tooltip={props.tooltip} />
            <Label>{props.label}</Label>
        </Container>
    )
}