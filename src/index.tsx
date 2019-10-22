import * as React from "react"
import * as ReactDOM from "react-dom"
import { Passage } from "./Components/Passage";
import { Global, css } from '@emotion/core'
import { Colors } from "./colors";
import { getCdnFontFaces } from '@hedviginsurance/brand'

const dataRoot = document.getElementById("storyData")
const storyDataNode = dataRoot.getElementsByTagName("tw-storydata")[0]
const startNodeID = storyDataNode.attributes["startnode"].value

const getAction = (actionNode: Element | undefined) => {
    if (!actionNode) {
        return null
    }

    const actionNodeOptions = Array.from(actionNode.getElementsByTagName("option")).map(option => {
        const text = option.textContent.replace(/(\r\n|\n|\r)/gm,"").trim()
        const links = text.match(/\[\[.+?\]\]/g) || []
        const transformedLinks = links.map(function(link) {
            var differentName = link.match(/\[\[(.*?)\->(.*?)\]\]/)

            if (differentName) {
              return {
                label: differentName[1],
                name: differentName[2]
              };
            } else {
              link = link.substring(2, link.length-2)
              return {
                name: link,
                label: link
              }
            }
          })

        if (transformedLinks.length > 1 || transformedLinks.length == 0) {
            throw "has no links"
        }

        const key = option.attributes["key"]
        const value = option.attributes["value"]

        return {
            key: key ? key.value : null,
            value: value ? value.value : null,
            link: transformedLinks[0]
        }
    })

    return {
        component: "SelectAction",
        options: actionNodeOptions
    }
}

const passages = Array.from(storyDataNode.getElementsByTagName("tw-passagedata")).map(passage => {
    const id = passage.attributes["pid"]
    const name = passage.attributes["name"]
    const text = passage.textContent

    var containerElement = document.createElement("div")
    containerElement.innerHTML = text

    const messages = Array.from(containerElement.getElementsByTagName("message")).map(message => {
        const delay = passage.attributes["delay"]

        return {
            text: message.textContent,
            delay: delay ? delay : 0
        }
    })

    const actionNode = containerElement.getElementsByTagName("selectaction")[0]

    return {
        id: id.value,
        name: name.value,
        messages: messages,
        action: getAction(actionNode)
    }
})

const Root = () => {
    const [currentPassageId, setCurrentPassageId] = React.useState(startNodeID)
    const passage = passages.filter(passage => passage.id == currentPassageId)[0]

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
                    background-image: url("http://localhost:3000/assets/background.png");
                    background-position: center;
                }
                ${getCdnFontFaces()}
            `}
            />
        <Passage passage={passage} changePassage={name => {
            const newPassage = passages.filter(passage => passage.name == name)[0]
            setCurrentPassageId(newPassage ? newPassage.id : startNodeID)
        }} />
    </>
}


ReactDOM.render(<Root />, document.getElementById("root"));