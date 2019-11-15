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
  const title = element.getElementsByTagName("Title")[0].textContent.trim();
  const description = element
    .getElementsByTagName("Description")[0]
    .textContent.trim();

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
    const links = parseLinks(option.textContent);

    const key = option.attributes["key"];
    const value = option.attributes["value"];

    const tooltips = parseTooltips(option);

    return {
      key: key ? key.value : null,
      value: value ? value.value : null,
      link: links[0],
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
  const placeholder = numberActionNode.attributes["placeholder"].value;
  const nextAttribute = numberActionNode.attributes["next"];
  const next = nextAttribute ? nextAttribute.value : null;
  const key = numberActionNode.attributes["key"].value;
  const unitAttribute = numberActionNode.attributes["unit"];
  const unit = unitAttribute ? unitAttribute.value : "";
  const mask =
    numberActionNode.attributes["mask"] &&
    numberActionNode.attributes["mask"].value;

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
  const key = dropdownActionNode.attributes["key"]
    ? dropdownActionNode.attributes["key"].value
    : null;
  const label = dropdownActionNode.attributes["label"]
    ? dropdownActionNode.attributes["label"].value
    : "";
  const options = Array.from(
    dropdownActionNode.getElementsByTagName("option")
  ).map(option => {
    return {
      value: option.attributes["value"]
        ? option.attributes["value"].value
        : option.textContent,
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
  const key = switchActionNode.attributes["key"]
    ? switchActionNode.attributes["key"].value
    : null;
  const label = switchActionNode.attributes["label"]
    ? switchActionNode.attributes["label"].value
    : "";

  const defaultValue = switchActionNode.attributes["defaultvalue"]
    ? switchActionNode.attributes["defaultvalue"].value == "true"
    : false;

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
  const maxAmount = multiActionNode.attributes["maxamount"].value;
  const key = multiActionNode.attributes["key"].value;
  const components = [];
  const next = multiActionNode.attributes["next"].value;

  const links = parseLinks(next);

  const addNode = multiActionNode.getElementsByTagName("add")[0];
  const addLabel = addNode.attributes["label"].value;

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
      link: links[0]
    }
  };
};

const getNumberActionSet = (numberActionSetNode: Element) => {
  const next = numberActionSetNode.attributes["next"].value;
  const links = parseLinks(next);

  const numberActions = Array.from(
    numberActionSetNode.getElementsByTagName("numberaction")
  ).map(numberActionNode => {
    const numberAction = getNumberAction(numberActionNode);

    return {
      ...numberAction,
      data: {
        title: numberActionNode.attributes["title"].value,
        ...numberAction.data
      }
    };
  });

  return {
    component: "NumberActionSet",
    data: {
      link: links[0],
      numberActions
    }
  };
};

const getTextAction = (textActionNode: Element) => {
  const placeholder = textActionNode.attributes["placeholder"].value;
  const next =
    textActionNode.attributes["next"] &&
    textActionNode.attributes["next"].value;
  const key = textActionNode.attributes["key"].value;
  const mask =
    textActionNode.attributes["mask"] &&
    textActionNode.attributes["mask"].value;

  const links = next ? parseLinks(next) : [];
  const tooltip = parseTooltips(textActionNode)[0];

  const api = parseApi(textActionNode);

  return {
    component: "TextAction",
    data: {
      placeholder,
      key,
      api,
      link: links[0],
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
      const expressionText = when.attributes["expression"].textContent;
      const expression = parseExpression(expressionText);

      if (expression) {
        return {
          ...expression,
          text: when.textContent.trim()
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
    const match = personalInformationApi.attributes["match"].value;
    const noMatch = personalInformationApi.attributes["noMatch"].value;
    const error = personalInformationApi.attributes["error"].value;
    return {
      component: "PersonalInformationApi",
      data: {
        match: parseLinks(match)[0],
        noMatch: parseLinks(noMatch)[0],
        error: parseLinks(error)[0]
      }
    };
  }

  return null;
};

export const parseStoryData = (storyData: any) => ({
  id: storyData.id,
  name: storyData.name,
  startPassage: storyData.startPassage,
  passages: storyData.passages.map(passage => {
    var containerElement = document.createElement("div");
    containerElement.innerHTML = passage.text;

    const messages = Array.from(
      containerElement.getElementsByTagName("message")
    ).map(message => {
      const delay = message.attributes["delay"];

      return {
        ...parsePossibleExpressionContent(message),
        delay: delay ? delay : 0
      };
    });

    const redirects = Array.from(
      containerElement.getElementsByTagName("redirect")
    ).map(redirect => {
      return {
        ...parseExpression(redirect.attributes["when"].textContent),
        to: parseLinks(redirect.attributes["to"].textContent)[0].name
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
