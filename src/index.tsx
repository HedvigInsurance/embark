import * as React from "react"
import * as ReactDOM from "react-dom"
import { Passage } from "./Components/Passage"
import { Proofing } from "./Components/Proofing"
import { Global, css } from '@emotion/core'
import { getCdnFontFaces } from "@hedviginsurance/brand"
import { createHashHistory } from 'history';

import { parseStoryData } from "./parseStoryData"
import { KeyValueStore, StoreContext } from "./Components/KeyValueStore";
import { passes } from "./Utils/ExpressionsUtil"

const scriptHost = document.getElementsByTagName("body")[0].attributes["scriptHost"].value
const isProofing = JSON.parse(document.getElementsByTagName("body")[0].attributes["isProofing"].value)
const data = parseStoryData(JSON.parse(document.getElementById("storyData").attributes["data"].value))

const getStartPassage = () => {
    const url = window.location.href
    const splitted = url.split("/")
    return url.includes("test") ? splitted[splitted.length - 1] : data.startPassage
}

export const history = createHashHistory({
    basename: `/stories/${data.id}/play`,
    hashType: 'hashbang',
    getUserConfirmation: null
})

const reducer = (state, action) => {
    switch (action.type) {
        case "GO_TO":
            history.push(`${action.passageId}`)
            return {
                ...state,
                history: [...state.history, action.passageId],
                passageId: action.passageId
            }
        case "GO_BACK":
            const historyLength = state.history.length
            return {
                ...state,
                history: state.history.slice(0, -1),
                passageId: state.history[historyLength - 2]
            }
        default:
            return state
    }
}

const Root = () => {
    const [state, dispatch] = React.useReducer(reducer, { history: [getStartPassage()], passageId: getStartPassage() })
    const passage = data.passages.filter(passage => passage.id == state.passageId)[0]

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
            <KeyValueStore>
                <StoreContext.Consumer>
                    {({ store }) => (
                        <Passage
                        history={state.history}
                        passage={passage}
                        goBack={() =>
                        {
                            dispatch({
                                type: "GO_BACK"
                            })
                        }
                        }
                        changePassage={name => {
                            const newPassage = data.passages.filter(passage => passage.name == name)[0]
                            const targetPassage = newPassage ? newPassage.id : data.startPassage
        
                            if (newPassage.redirects.length > 0) {
                                const passableExpressions = newPassage.redirects.filter(expression => {
                                    return passes(store, expression)
                                })

                                if (passableExpressions.length > 0) {
                                    const { to } = passableExpressions[0]
                                    const redirectTo = data.passages.filter(passage => passage.name == to)[0]

                                    dispatch({
                                        type: "GO_TO",
                                        passageId: redirectTo ? redirectTo.id : targetPassage
                                    })
                                    return
                                } 
                            }

                            dispatch({
                                type: "GO_TO",
                                passageId: targetPassage
                            })
                        }} />
                    )}
                </StoreContext.Consumer>
            </KeyValueStore>
    </>
}


ReactDOM.render(<Root />, document.getElementById("root"));