import * as React from "react";
import * as ReactDOM from "react-dom";
import { Passage } from "./Components/Passage";
import { Proofing } from "./Components/Proofing";
import { Global, css } from "@emotion/core";
import { getCdnFontFaces } from "@hedviginsurance/brand";
import { createHashHistory } from "history";

import { parseStoryData } from "./parseStoryData";
import { Header } from "./Components/Header";
import { useGoTo } from "./Utils/ExpressionsUtil";
import { EmbarkProvider } from "./Components/EmbarkProvider";
import { mockApiResolvers } from "./Components/API/ApiContext";

declare global {
  interface Window {
    requestIdleCallback: (
      callback: () => any,
      options: { timeout?: number }
    ) => void;
  }
}

if (!window.requestIdleCallback) {
  window.requestIdleCallback = require("requestidlecallback").request;
}

const scriptHost = document
  .getElementsByTagName("body")[0]
  .getAttribute("scriptHost");
const isProofing = JSON.parse(
  document.getElementsByTagName("body")[0].getAttribute("isProofing") || "false"
);
const storyDataElement = document.getElementById("storyData");
const data = parseStoryData(
  JSON.parse(
    storyDataElement ? storyDataElement.getAttribute("data") || "null" : "null"
  )
);

const getStartPassage = () => {
  const url = window.location.href;
  const splitted = url.split("/");

  if (url.includes("play") || url.includes("test")) {
    const hasPassage = data.passages.filter(
      (passage: any) => passage.id == splitted[splitted.length - 1]
    )[0];
    return hasPassage ? splitted[splitted.length - 1] : data.startPassage;
  }

  return data.startPassage;
};

export const history = createHashHistory({
  basename: `/stories/${data.id}/${
    window.location.href.includes("play") ? "play" : "test"
  }`,
  hashType: "hashbang"
});

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "GO_TO":
      const passage = data.passages.find(
        (passage: any) => passage.id == state.passageId
      );

      if (passage.api) {
        return {
          ...state,
          history: [...state.history],
          passageId: action.passageId
        };
      }

      history.push(`${action.passageId}`);
      return {
        ...state,
        history: [...state.history, action.passageId],
        passageId: action.passageId
      };
    case "GO_BACK":
      const historyLength = state.history.length;
      return {
        ...state,
        history: state.history.slice(0, -1),
        passageId: state.history[historyLength - 2]
      };
    default:
      return state;
  }
};

const Root = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    history: [getStartPassage()],
    passageId: getStartPassage()
  });
  const passage = data.passages.find(
    (passage: any) => passage.id == state.passageId
  );
  const goTo = useGoTo(data, targetPassageId => {
    dispatch({
      type: "GO_TO",
      passageId: targetPassageId
    });
  });

  if (isProofing) {
    return (
      <>
        <Global
          styles={css`
            * {
              margin: 0;
              padding: 0;
            }

            ul,
            li {
              list-style-type: none;
            }

            ${getCdnFontFaces()};
          `}
        />
        <Proofing name={data.name} passages={data.passages} />
      </>
    );
  }

  return (
    <>
      <Global
        styles={css`
                * {
                    margin: 0;
                    padding: 0;
                    -webkit-font-smoothing: antialiased;
	                  -moz-osx-font-smoothing: grayscale;
                }

                #root {
                  height: 100%;
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
      <Header passage={passage} storyData={data} />
      <Passage
        canGoBack={state.history.length > 1}
        historyGoBackListener={onGoBack =>
          history.listen((_, action) => {
            if (action == "POP") {
              onGoBack();
            }
          })
        }
        passage={passage}
        goBack={() => {
          dispatch({
            type: "GO_BACK"
          });
        }}
        changePassage={name => {
          goTo(name);
        }}
      />
    </>
  );
};

const RootContainer = () => (
  <EmbarkProvider
    data={data}
    resolvers={mockApiResolvers}
    externalRedirects={{
      Offer: () => {
        console.log("Should redirect to Offer!");
      }
    }}
  >
    <Root />
  </EmbarkProvider>
);

ReactDOM.render(<RootContainer />, document.getElementById("root"));
