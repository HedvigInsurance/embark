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

    return {
      key: key,
      value: value,
      link: links && links[0],
      tooltip: tooltips[0] ? tooltips[0] : null
    };
  });

  const api = parseApi(actionNode);

  return {
    component: "SelectAction",
    data: {
      options: actionNodeOptions,
      api
    }
  };
};

const getNumberAction = (numberActionNode: Element) => {
  const placeholder = numberActionNode.getAttribute("placeholder");
  const next = numberActionNode.getAttribute("next") || "";
  const key = numberActionNode.getAttribute("key");
  const unit = numberActionNode.getAttribute("unit") || "";
  const mask = numberActionNode.getAttribute("mask");

  const links = parseLinks(next);
  const tooltip = parseTooltips(numberActionNode)[0];
  const api = parseApi(numberActionNode);

  return {
    component: "NumberAction",
    data: {
      placeholder,
      key,
      unit,
      api,
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
    component: "NumberActionSet",
    data: {
      link: links && links[0],
      numberActions
    }
  };
};

const getTextAction = (textActionNode: Element) => {
  const placeholder = textActionNode.getAttribute("placeholder");
  const next = textActionNode.getAttribute("next");
  const key = textActionNode.getAttribute("key");
  const mask = textActionNode.getAttribute("mask");

  const links = next ? parseLinks(next) : [];
  const tooltip = parseTooltips(textActionNode)[0];

  const api = parseApi(textActionNode);

  return {
    component: "TextAction",
    data: {
      placeholder,
      key,
      api,
      link: links && links[0],
      mask,
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

  return null;
};

const parseExpression = (expression: string) => {
  if (expression.includes("==")) {
    const splitted = expression.split("==");

    return {
      type: "EQUALS",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression.includes(">")) {
    const splitted = expression.split(">");

    return {
      type: "MORE_THAN",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression.includes(">=")) {
    const splitted = expression.split(">=");

    return {
      type: "MORE_THAN_OR_EQUALS",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression.includes("<")) {
    const splitted = expression.split("<");

    return {
      type: "LESS_THAN",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression.includes("<=")) {
    const splitted = expression.split("<=");

    return {
      type: "LESS_THAN_OR_EQUALS",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression.includes("!=")) {
    const splitted = expression.split("!=");
    return {
      type: "NOT_EQUALS",
      key: splitted[0].trim(),
      value: splitted[1].trim().replace(/'/g, "")
    };
  }

  if (expression == "true") {
    return {
      type: "ALWAYS"
    };
  }

  if (expression == "false") {
    return {
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
    expressions: [],
    text: `{${passageName}Result}`
  };
};

const parseGroupedResponse = (element: Element) => {
  const title = element.getElementsByTagName("title")[0];
  const items = Array.from(element.getElementsByTagName("item"));

  return {
    component: "GroupedResponse",
    title: parsePossibleExpressionContent(title),
    items: items.map(parsePossibleExpressionContent)
  };
};

const parseApi = (element: Element) => {
  const personalInformationApi = element.getElementsByTagName(
    "personalinformationapi"
  )[0];

  if (personalInformationApi) {
    const match = personalInformationApi.getAttribute("match");
    const noMatch = personalInformationApi.getAttribute("noMatch");
    const error = personalInformationApi.getAttribute("error");

    const matchLinks = parseLinks(match || "");
    const noMatchLinks = parseLinks(noMatch || "");
    const errorLinks = parseLinks(error || "");

    return {
      component: "PersonalInformationApi",
      data: {
        match: matchLinks && matchLinks[0],
        noMatch: noMatchLinks && noMatchLinks[0],
        error: errorLinks && errorLinks[0]
      }
    };
  }

  return null;
};

export const parseStoryData = (storyData: any) => ({
  id: storyData.id,
  name: storyData.name,
  startPassage: storyData.startPassage,
  passages: storyData.passages.map((passage: any) => {
    var containerElement = document.createElement("div");
    containerElement.innerHTML = passage.text;

    const messages = Array.from(
      containerElement.getElementsByTagName("message")
    ).map(message => parsePossibleExpressionContent(message));

    const redirects = Array.from(
      containerElement.getElementsByTagName("redirect")
    ).map(redirect => {
      redirect.getAttribute;
      const whenAttribute = redirect.getAttribute("when");
      const toAttribute = redirect.getAttribute("to");
      const links = parseLinks(toAttribute || "");

      return {
        ...parseExpression(whenAttribute || ""),
        to: links && links[0].name
      };
    });

    return {
      id: passage.id,
      text: passage.text,
      name: passage.name,
      allLinks: parseLinks(passage.text) || [],
      messages,
      redirects,
      action: getAction(containerElement),
      response: getResponse(passage.name, containerElement),
      tooltips: Array.from(
        containerElement.getElementsByTagName("Tooltip")
      ).map(parseTooltip)
    };
  })
});
