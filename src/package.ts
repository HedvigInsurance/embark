if (typeof window !== "undefined") {
  if (!window.requestIdleCallback) {
    window.requestIdleCallback = require("requestidlecallback").request;
  }
}

export { KeyValueStore } from "./Components/KeyValueStore";
export { Passage } from "./Components/Passage";
export { Header } from "./Components/Header";
export { useGoTo } from "./Utils/ExpressionsUtil";
export { EmbarkProvider } from "./Components/EmbarkProvider";

export {
  Data as PersonalInformationData
} from "./Components/API/personalInformation";
export {
  Data as HouseInformationData,
  Variables as HouseInformationVariables
} from "./Components/API/houseInformation";
export {
  Data as CreateQuoteData,
  Variables as CreateQuoteVariables
} from "./Components/API/createQuote";