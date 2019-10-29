const parseLinks = (text: string) => {
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

  return {
    component: "SelectAction",
    data: {
      options: actionNodeOptions
    }
  };
};

const getNumberAction = (numberActionNode: Element) => {
  const placeholder = numberActionNode.attributes["placeholder"].value;
  const next = numberActionNode.attributes["next"].value;
  const key = numberActionNode.attributes["key"].value;
  const unit = numberActionNode.attributes["unit"].value;

  const links = parseLinks(next);
  const tooltip = parseTooltips(numberActionNode)[0];

  return {
    component: "NumberAction",
    data: {
      placeholder,
      key,
      unit,
      link: links[0],
      ...(tooltip && { tooltip })
    }
  };
};

const getTextAction = (textActionNode: Element) => {
  const placeholder = textActionNode.attributes["placeholder"].value;
  const next = textActionNode.attributes["next"].value;
  const key = textActionNode.attributes["key"].value;

  const links = parseLinks(next);
  const tooltip = parseTooltips(textActionNode)[0];

  return {
    component: "TextAction",
    data: {
      placeholder,
      key,
      link: links[0],
      ...(tooltip && { tooltip })
    }
  };
};

const getAction = (containerElement: Element) => {
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
  const responseNode = containerElement.getElementsByTagName("response")[0];

  if (responseNode) {
    return parsePossibleExpressionContent(responseNode);
  }

  return {
    expressions: [],
    text: `{${passageName}Result}`
  };
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
      messages,
      redirects,
      action: getAction(containerElement),
      response: getResponse(passage.name, containerElement)
    };
  })
});
