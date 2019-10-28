import * as React from 'react'
import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { colors, fonts } from "@hedviginsurance/brand"

const TooltipIcon = styled(motion.div)`
    background-color: ${colors.LIGHT_GRAY};
    width: 28px;
    height: 28px;
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    text-align: center;

    svg {
        margin: 0 auto;
    }
`

const TooltipContainer = styled(motion.div)`
    position: absolute;
    top: -40px;
    right: 0px;
`

const Tooltippy = styled.div`
    background-color: ${colors.PURPLE};
    border-radius: 10px;
    color: ${colors.WHITE};
    display: flex;
    align-items: center;
    text-align: center;
    padding: 10px;
    font-family: ${fonts.CIRCULAR};
`

interface TooltipProps {
    tooltip?: {
        title: string
        description: string
    }
}

export const Tooltip: React.FunctionComponent<TooltipProps> = (props) => {
    const [showTooltip, setShowTooltip] = React.useState(false)
        return props.tooltip ? <>
            <TooltipContainer
                initial="hidden"
                animate={showTooltip ? "visible" : "hidden"}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 125
                }}
                variants={{
                    visible: {
                        opacity: 1,
                        y: 0
                    },
                    hidden: {
                        opacity: 0,
                        y: 5
                    }
                }}>
                <Tooltippy>{props.tooltip.description}</Tooltippy>
            </TooltipContainer>
            <TooltipIcon onHoverStart={() => {
            setShowTooltip(true)
        }} onHoverEnd={() => setShowTooltip(false)}>
            <svg width="8px" height="12px" viewBox="0 0 8 12" version="1.1">
                <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Desktop/Information-Icon/Off" transform="translate(-8.000000, -6.000000)" fill="#9B9BAA">
                        <path d="M12.5781938,14.4377565 C12.561674,14.3392613 12.561674,14.2571819 12.561674,14.2243502 C12.561674,13.5841313 12.842511,13.0424077 13.3876652,12.6648427 L14.0980176,12.1723666 C15.0561674,11.499316 15.75,10.5800274 15.75,9.28317373 C15.75,7.60875513 14.4284141,6 11.9834802,6 C9.48898678,6 8.25,7.78932969 8.25,9.43091655 C8.25,9.69357045 8.28303965,9.95622435 8.34911894,10.1860465 L10.215859,10.3173735 C10.1497797,10.1367989 10.1167401,9.8248974 10.1167401,9.57865937 C10.1167401,8.64295486 10.7610132,7.70725034 11.9834802,7.70725034 C13.1894273,7.70725034 13.7676211,8.51162791 13.7676211,9.36525308 C13.7676211,9.92339261 13.5363436,10.3994528 12.9911894,10.7934337 L12.2312775,11.3351573 C11.2731278,12.0246238 10.8931718,12.8290014 10.8931718,13.8139535 C10.8931718,14.0437756 10.9096916,14.2243502 10.9262115,14.4377565 L12.5781938,14.4377565 Z M10.5627753,16.8016416 C10.5627753,17.4582763 11.0914097,18 11.7687225,18 C12.4295154,18 12.9746696,17.4582763 12.9746696,16.8016416 C12.9746696,16.1450068 12.4295154,15.5868673 11.7687225,15.5868673 C11.0914097,15.5868673 10.5627753,16.1450068 10.5627753,16.8016416 Z" id="?"></path>
                    </g>
                </g>
            </svg>
        </TooltipIcon>
        </> : null
}