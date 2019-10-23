import * as React from "react"
import * as ReactDOM from "react-dom"
import { Passage } from "./Components/Passage";
import { Global, css } from '@emotion/core'
import { Colors } from "./colors";
import { getCdnFontFaces } from '@hedviginsurance/brand'

const scriptHost = document.getElementsByTagName("body")[0].attributes["scriptHost"].value
const data = JSON.parse(document.getElementById("storyData").attributes["data"].value)

const Root = () => {
    const [currentPassageId, setCurrentPassageId] = React.useState(data.startNode)
    const passage = data.passages.filter(passage => passage.id == currentPassageId)[0]

    return <>
        <Global
            styles={css`
                * {
                    margin: 0;
                    padding: 0;
                }

                ul {
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
            setCurrentPassageId(newPassage ? newPassage.id : data.startNode)
        }} />
    </>
}


ReactDOM.render(<Root />, document.getElementById("root"));