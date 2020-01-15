import { getTextContent } from "./Components/Common";
const parseLinks = (text: string) => {
  if (!text) {
    return null;
  }

  const trimmedText = text.replace(/(\r\n|\n|\r)/gm, "").trim();
  const links = trimmedText.match(/\[\[.+?\]\]/g) || [];
  const transformedLinks = links.map(function(link) {
    var differentName = link.match(/\[\[(.*?)\->(.*?)\]\]/);

    if (differentName) {
      return {
        label: differentName[1],
        name: differentName[2]
      };
    } else {
      link = link.substring(2, link.length - 2);
      return {
        name: link,
        label: link
      };
    }
  });

  return transformedLinks;
};

const parseTooltips = (containerElement: Element) => {
  const tooltips = Array.from(containerElement.getElementsByTagName("Tooltip"));

  return tooltips.map(parseTooltip);
};

const parseTooltip = (element: Element) => {
  const title = (
    element.getElementsByTagName("Title")[0].textContent || ""
  ).trim();
  const description = (
    element.getElementsByTagName("Description")[0].textContent || ""
  ).trim();

  return {
    title,
    description
  };
};

/*
<ExternalRedirect to="Offer"></ExternalRedirect>
*/

const parseExternalRedirect = (containerElement: Element) => {
  const node = containerElement.getElementsByTagName("ExternalRedirect")[0];

  if (!node) {
    return null;
  }

  const location = node.getAttribute("to");

  return {
    component: "ExternalRedirect",
    data: {
      location
    }
  };
};

const getSelectAction = (actionNode: Element | undefined) => {
  if (!actionNode) {
    return null;
  }

  const actionNodeOptions = Array.from(
    actionNode.getElementsByTagName("option")
  ).map(option => {
    const links = parseLinks(option.textContent || "");

    const key = option.getAttribute("key");
    const value = option.getAttribute("value");

    const tooltips = parseTooltips(option);

    const api = parseApi(option);

    return {
      key,
      value,
      link: links && links[0],
      tooltip: tooltips[0] ? tooltips[0] : null,
      api
    };
  });

  return {
    __typename: "AngelSelectAction",
    component: "SelectAction",
    data: {
      options: actionNodeOptions
    }
  };
};

const getNumberAction = (numberActionNode: Element) => {
  const placeholder = numberActionNode.getAttribute("placeholder");
  const next = numberActionNode.getAttribute("next") || "";
  const key = numberActionNode.getAttribute("key");
  const unit = numberActionNode.getAttribute("unit") || "";
  const mask = numberActionNode.getAttribute("mask");
  const minValue = numberActionNode.getAttribute("minvalue");
  const maxValue = numberActionNode.getAttribute("maxvalue");

  const links = parseLinks(next);
  const tooltip = parseTooltips(numberActionNode)[0];
  const api = parseApi(numberActionNode);

  return {
    __typename: "AngelNumberAction",
    component: "NumberAction",
    data: {
      placeholder,
      key,
      unit,
      api,
      minValue,
      maxValue,
      ...(links && { link: links[0] }),
      mask,
      ...(tooltip && { tooltip })
    }
  };
};

const getDropdownAction = (dropdownActionNode: Element) => {
  const key = dropdownActionNode.getAttribute("key");
  const label = dropdownActionNode.getAttribute("label") || "";
  const options = Array.from(
    dropdownActionNode.getElementsByTagName("option")
  ).map(option => {
    return {
      value: option.getAttribute("value") || option.textContent,
      text: option.textContent
    };
  });

  return {
    __typename: "AngelDropdownAction",
    component: "DropdownAction",
    data: {
      label,
      key,
      options
    }
  };
};

const getSwitchAction = (switchActionNode: Element) => {
  const key = switchActionNode.getAttribute("key");
  const label = switchActionNode.getAttribute("label") || "";
  const defaultValue =
    switchActionNode.getAttribute("defaultvalue") == "true" ? true : false;

  return {
    __typename: "AngelSwitchAction",
    component: "SwitchAction",
    data: {
      label,
      key,
      defaultValue
    }
  };
};

const getMultiAction = (multiActionNode: Element) => {
  const maxAmount = multiActionNode.getAttribute("maxamount");
  const key = multiActionNode.getAttribute("key");
  const components: Array<any> = [];
  const next = multiActionNode.getAttribute("next");

  const links = parseLinks(next || "");

  const addNode = multiActionNode.getElementsByTagName("add")[0];
  const addLabel = addNode.getAttribute("label");

  Array.from(addNode.getElementsByTagName("dropdownaction")).forEach(
    dropdownNode => {
      components.push(getDropdownAction(dropdownNode));
    }
  );

  Array.from(addNode.getElementsByTagName("numberaction")).forEach(
    numberActionNode => {
      components.push(getNumberAction(numberActionNode));
    }
  );

  Array.from(addNode.getElementsByTagName("switchaction")).forEach(
    switchActionNode => {
      components.push(getSwitchAction(switchActionNode));
    }
  );

  const api = parseApi(multiActionNode);

  return {
    __typename: "AngelMultiAction",
    component: "MultiAction",
    data: {
      key,
      addLabel,
      components,
      maxAmount,
      api,
      link: links && links[0]
    }
  };
};

const getNumberActionSet = (numberActionSetNode: Element) => {
  const next = numberActionSetNode.getAttribute("next");
  const links = parseLinks(next || "");

  const numberActions = Array.from(
    numberActionSetNode.getElementsByTagName("numberaction")
  ).map(numberActionNode => {
    const numberAction = getNumberAction(numberActionNode);

    return {
      ...numberAction,
      data: {
        title: numberActionNode.getAttribute("title"),
        ...numberAction.data
      }
    };
  });

  return {
    __typename: "AngelNumberActionSet",
    component: "NumberActionSet",
    data: {
      link: links && links[0],
      numberActions
    }
  };
};

const getTextActionSet = (textActionSetNode: Element) => {
  const next = textActionSetNode.getAttribute("next");
  const links = parseLinks(next || "");

  const textActions = Array.from(
    textActionSetNode.getElementsByTagName("textaction")
  ).map(textActionNode => {
    const textAction = getTextAction(textActionNode);

    return {
      ...textAction,
      data: {
        title: textActionNode.getAttribute("title"),
        ...textAction.data
      }
    };
  });

  const api = parseApi(textActionSetNode);

  return {
    __typename: "AngelTextActionSet",
    component: "TextActionSet",
    data: {
      link: links && links[0],
      textActions,
      api
    }
  };
};

const getTextAction = (textActionNode: Element) => {
  const placeholder = textActionNode.getAttribute("placeholder");
  const next = textActionNode.getAttribute("next");
  const key = textActionNode.getAttribute("key");
  const mask = textActionNode.getAttribute("mask");

  const large = textActionNode.getAttribute("large");

  const links = next ? parseLinks(next) : [];
  const tooltip = parseTooltips(textActionNode)[0];

  const api = parseApi(textActionNode);

  return {
    __typename: "AngelTextAction",
    component: "TextAction",
    data: {
      placeholder,
      key,
      api,
      link: links && links[0],
      large,
      mask,
      ...(tooltip && { tooltip })
    }
  };
};

const getExternalInsuranceProviderAction = (
  externalInsuranceProviderActionNode: Element
) => {
  const next = externalInsuranceProviderActionNode.getAttribute("next");
  const skip = externalInsuranceProviderActionNode.getAttribute("skip");
  const skipLinks = skip ? parseLinks(skip) : [];
  const nextLinks = next ? parseLinks(next) : [];

  return {
    component: "ExternalInsuranceProviderAction",
    data: {
      next: nextLinks && nextLinks[0],
      skip: skipLinks && skipLinks[0]
    }
  };
};

const getPreviousInsuranceProviderAction = (
  previousInsuranceProviderActionNode: Element
) => {
  const next = previousInsuranceProviderActionNode.getAttribute("next");
  const skip = previousInsuranceProviderActionNode.getAttribute("skip");
  const skipLinks = skip ? parseLinks(skip) : [];
  const nextLinks = next ? parseLinks(next) : [];

  const tooltip = parseTooltips(previousInsuranceProviderActionNode)[0];

  return {
    component: "PreviousInsuranceProviderAction",
    data: {
      next: nextLinks && nextLinks[0],
      skip: skipLinks && skipLinks[0],
      ...(tooltip && { tooltip })
    }
  };
};

const getAction = (containerElement: Element) => {
  const numberActionSetNode = containerElement.getElementsByTagName(
    "numberactionset"
  )[0];

  if (numberActionSetNode) {
    return getNumberActionSet(numberActionSetNode);
  }

  const textActionSetNode = containerElement.getElementsByTagName(
    "textactionset"
  )[0];

  if (textActionSetNode) {
    return getTextActionSet(textActionSetNode);
  }

  const multiActionNode = containerElement.getElementsByTagName(
    "multiaction"
  )[0];

  if (multiActionNode) {
    return getMultiAction(multiActionNode);
  }

  const selectActionNode = containerElement.getElementsByTagName(
    "selectaction"
  )[0];

  if (selectActionNode) {
    return getSelectAction(selectActionNode);
  }

  const numberActionNode = containerElement.getElementsByTagName(
    "numberaction"
  )[0];

  if (numberActionNode) {
    return getNumberAction(numberActionNode);
  }

  const textActionNode = containerElement.getElementsByTagName("textaction")[0];

  if (textActionNode) {
    return getTextAction(textActionNode);
  }

  const externalInsuranceProviderActionNode = containerElement.getElementsByTagName(
    "externalinsuranceprovideraction"
  )[0];

  if (externalInsuranceProviderActionNode) {
    return getExternalInsuranceProviderAction(
      externalInsuranceProviderActionNode
    );
  }

  const previousInsuranceProviderActionNode = containerElement.getElementsByTagName(
    "previousinsuranceprovideraction"
  )[0];

  if (previousInsuranceProviderActionNode) {
    return getPreviousInsuranceProviderAction(
      previousInsuranceProviderActionNode
    );
  }

  return null;
};

interface BinaryExpression {
  __typename: string;
  type: string;
  key: string;
  value: string;
}

interface UnaryExpression {
  __typename: string;
  type: string;
}

type SingleExpression = UnaryExpression | BinaryExpression;

interface MultipleExpressions {
  __typename: string;
  type: "AND" | "OR";
  subExpressions: Expression[];
}

type Expression = SingleExpression | MultipleExpressions;

const AND_REGEX = /^(.+)&&(.+)$/;
const OR_REGEX = /^(.+)\|\|(.+)$/;

const parseExpression = (expression: string): Expression | null => {
  if (expression.includes("&&")) {
    const splitted = expression.match(AND_REGEX);

    if (!splitted) {
      return null;
    }

    return {
      __typename: "AngelExpressionMultiple",
      type: "AND",
      subExpressions: [
        parseExpression(splitted[1].trim()),
        parseExpression(splitted[2].trim())
      ] as Expression[]
    };
  }

  if (expression.includes("||")) {
    const splitted = expression.match(OR_REGEX);

    if (!splitted) {
      return null;
    }

    return {
      __typename: "AngelExpressionMultiple",
      type: "OR",
      subExpressions: [
        parseExpression(splitted[1].trim()),
        parseExpression(splitted[2].trim())
      ] as Expression[]
    };
  }

  if (expression.includes("==")) {
    const splitted = expression.split("==");

    return {
      __typename: "AngelExpressionBinary",
      type: "EQUALS",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression.includes(">=")) {
    const splitted = expression.split(">=");

    return {
      __typename: "AngelExpressionBinary",
      type: "MORE_THAN_OR_EQUALS",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression.includes("<=")) {
    const splitted = expression.split("<=");

    return {
      __typename: "AngelExpressionBinary",
      type: "LESS_THAN_OR_EQUALS",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression.includes(">")) {
    const splitted = expression.split(">");

    return {
      __typename: "AngelExpressionBinary",
      type: "MORE_THAN",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression.includes("<")) {
    const splitted = expression.split("<");

    return {
      __typename: "AngelExpressionBinary",
      type: "LESS_THAN",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression.includes("!=")) {
    const splitted = expression.split("!=");
    return {
      __typename: "AngelExpressionBinary",
      type: "NOT_EQUALS",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression == "true") {
    return {
      __typename: "AngelExpressionUnary",
      type: "ALWAYS"
    };
  }

  if (expression == "false") {
    return {
      __typename: "AngelExpressionUnary",
      type: "NEVER"
    };
  }

  return null;
};

const parsePossibleExpressionContent = (containerElement: Element) => {
  const expressions = Array.from(containerElement.getElementsByTagName("When"))
    .map(when => {
      const expressionText = when.getAttribute("expression") || "";
      const expression = parseExpression(expressionText);

      if (expression) {
        return {
          ...expression,
          text: (when.textContent || "").trim()
        };
      }

      return null;
    })
    .filter(expression => expression);

  return {
    expressions,
    text: containerElement.textContent
  };
};

const getResponse = (passageName: string, containerElement: Element) => {
  const groupedResponse = containerElement.getElementsByTagName(
    "groupedresponse"
  )[0];
  if (groupedResponse) {
    return parseGroupedResponse(groupedResponse);
  }

  const responseNode = containerElement.getElementsByTagName("response")[0];

  if (responseNode) {
    return parsePossibleExpressionContent(responseNode);
  }

  return {
    __typename: "AngelMessage",
    expressions: [],
    text: `{${passageName}Result}`
  };
};

const parseEach = (element: Element) => {
  const key = element.getAttribute("key");

  const content = parsePossibleExpressionContent(element);

  return {
    __typename: "AngelGroupedResponseEach",
    key,
    content
  };
};

const parseGroupedResponse = (element: Element) => {
  const title = element.getElementsByTagName("title")[0];
  const items = Array.from(element.getElementsByTagName("item"));
  const each = element.getElementsByTagName("each")[0];

  return {
    __typename: "AngelGroupedResponse",
    component: "GroupedResponse",
    title: parsePossibleExpressionContent(title),
    items: items.map(parsePossibleExpressionContent),
    each: (each && parseEach(each)) || []
  };
};

const getFirstLevelNodes = (node: Element) => {
  var children = new Array();
  for (var child in node.childNodes) {
    if (node.childNodes[child].nodeType == 1) {
      children.push(node.childNodes[child]);
    }
  }
  return children;
};

const parseApi = (element: Element, allowNestedChildren: boolean = true) => {
  const personalInformationApi = element.getElementsByTagName(
    "personalinformationapi"
  )[0];

  if (personalInformationApi) {
    if (
      allowNestedChildren == false &&
      !getFirstLevelNodes(element).includes(personalInformationApi)
    ) {
      return null;
    }

    const match = personalInformationApi.getAttribute("match");
    const noMatch = personalInformationApi.getAttribute("noMatch");
    const error = personalInformationApi.getAttribute("error");

    const matchLinks = parseLinks(match || "");
    const noMatchLinks = parseLinks(noMatch || "");
    const errorLinks = parseLinks(error || "");

    return {
      __typename: "AngelApiPersonalInformation",
      component: "PersonalInformationApi",
      data: {
        match: matchLinks && matchLinks[0],
        noMatch: noMatchLinks && noMatchLinks[0],
        error: errorLinks && errorLinks[0]
      }
    };
  }

  const houseInformationApi = element.getElementsByTagName(
    "houseinformationapi"
  )[0];

  if (houseInformationApi) {
    if (
      allowNestedChildren == false &&
      !getFirstLevelNodes(element).includes(houseInformationApi)
    ) {
      return null;
    }

    const match = houseInformationApi.getAttribute("match");
    const noMatch = houseInformationApi.getAttribute("noMatch");
    const error = houseInformationApi.getAttribute("error");

    const matchLinks = parseLinks(match || "");
    const noMatchLinks = parseLinks(noMatch || "");
    const errorLinks = parseLinks(error || "");

    return {
      __typename: "AngelApiHouseInformation",
      component: "HouseInformationApi",
      data: {
        match: matchLinks && matchLinks[0],
        noMatch: noMatchLinks && noMatchLinks[0],
        error: errorLinks && errorLinks[0]
      }
    };
  }

  const createQuoteApi = element.getElementsByTagName("createquoteapi")[0];

  if (createQuoteApi) {
    if (
      allowNestedChildren == false &&
      !getFirstLevelNodes(element).includes(createQuoteApi)
    ) {
      return null;
    }

    const uwlimits = createQuoteApi.getAttribute("uwlimits");
    const success = createQuoteApi.getAttribute("success");
    const error = createQuoteApi.getAttribute("error");

    const uwlimitsLinks = parseLinks(uwlimits || "");
    const successLinks = parseLinks(success || "");
    const errorLinks = parseLinks(error || "");

    return {
      __typename: "AngelApiCreateQuote",
      component: "CreateQuoteApi",
      data: {
        uwlimits: uwlimitsLinks && uwlimitsLinks[0],
        success: successLinks && successLinks[0],
        error: errorLinks && errorLinks[0]
      }
    };
  }

  return null;
};

const parseTrack = (element: Element) => {
  const trackElement = element.getElementsByTagName("track")[0];

  if (trackElement) {
    const eventName = trackElement.getAttribute("name");
    const eventKeys = trackElement.getAttribute("keys") || "";

    if (!eventName) {
      return null;
    }

    return {
      eventName,
      eventKeys: eventKeys
        .replace(/^\[/g, "")
        .replace(/\]$/g, "")
        .split(",")
        .filter(key => key)
    };
  }

  return null;
};

export const parseStoryData = (storyData: any) => ({
  id: storyData.id,
  name: storyData.name,
  startPassage: storyData.startPassage,
  keywords: storyData.keywords || {},
  partnerConfigs: storyData.partnerConfigs || [],
  passages: storyData.passages.map((passage: any) => {
    var containerElement = document.createElement("div");
    containerElement.innerHTML = passage.text;

    const api = parseApi(containerElement, false);
    const track = parseTrack(containerElement);

    const messages = Array.from(
      containerElement.getElementsByTagName("message")
    ).map(message => parsePossibleExpressionContent(message));

    const redirects = Array.from(
      containerElement.getElementsByTagName("redirect")
    )
      .map(redirect => {
        redirect.getAttribute;
        const whenAttribute = redirect.getAttribute("when");
        const toAttribute = redirect.getAttribute("to");
        const links = parseLinks(toAttribute || "");

        const expression = parseExpression(whenAttribute || "");

        if (!expression || !links) {
          return null;
        }

        if (expression.__typename === "AngelExpressionUnary") {
          return {
            ...expression,
            __typename: "AngelRedirectUnaryExpression",
            to: links[0].name
          };
        }

        if (expression.__typename === "AngelExpressionBinary") {
          return {
            ...expression,
            __typename: "AngelRedirectBinaryExpression",
            to: links[0].name
          };
        }

        return {
          ...expression,
          __typename: "AngelRedirectMultipleExpressions",
          to: links[0].name
        };
      })
      .filter(item => item);

    const externalRedirect = parseExternalRedirect(containerElement);

    return {
      id: passage.id,
      text: passage.text,
      name: passage.name,
      url: passage.url,
      allLinks: parseLinks(passage.text) || [],
      api: api || null,
      track,
      messages,
      redirects,
      externalRedirect,
      action: getAction(containerElement),
      response: getResponse(passage.name, containerElement),
      tooltips: Array.from(
        containerElement.getElementsByTagName("Tooltip")
      ).map(parseTooltip)
    };
  })
});
