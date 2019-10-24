import * as React from "react"
import * as ReactDOM from "react-dom"
import { Passage } from "./Components/Passage"
import { Proofing } from "./Components/Proofing"
import { Global, css } from '@emotion/core'
import { Colors } from "./colors";
import { getCdnFontFaces } from "@hedviginsurance/brand"

import { parseStoryData } from "./parseStoryData"

const scriptHost = document.getElementsByTagName("body")[0].attributes["scriptHost"].value
const isProofing = JSON.parse(document.getElementsByTagName("body")[0].attributes["isProofing"].value)
const data = parseStoryData(JSON.parse(document.getElementById("storyData").attributes["data"].value))

const getStartPassage = () => {
    const url = window.location.href
    const splitted = url.split("/")
    return url.includes("test") ? splitted[splitted.length - 1] : data.startPassage
}

const Root = () => {
    const [currentPassageId, setCurrentPassageId] = React.useState(getStartPassage())
    const passage = data.passages.filter(passage => passage.id == currentPassageId)[0]

    if (isProofing) {
        return <>
            <Global
                styles={css`
                    * {
                        margin: 0;
                        padding: 0;
                    }

                    ul, li {
                        list-style-type: none;
                    }

                    ${getCdnFontFaces()}
                `}
                />
            <Proofing name={data.name} passages={data.passages} />
        </>
    }

    return <>
        <Global
            styles={css`
                * {
                    margin: 0;
                    padding: 0;
                }

                ul, li {
                    list-style-type: none;
                }

                html {
                    background-image: url("${scriptHost}/assets/background.png");
                    background-position: center;
                }
                ${getCdnFontFaces()}
            `}
            />
        <Passage passage={passage} changePassage={name => {
            const newPassage = data.passages.filter(passage => passage.name == name)[0]
            setCurrentPassageId(newPassage ? newPassage.id : data.startPassage)
        }} />
    </>
}


ReactDOM.render(<Root />, document.getElementById("root"));