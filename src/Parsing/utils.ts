export const getFirstLevelNodes = (node: Element) => {
  var children = new Array();
  for (var child in node.childNodes) {
    if (node.childNodes[child].nodeType == 1) {
      children.push(node.childNodes[child]);
    }
  }
  return children;
};

export const parseLinks = (text: string) => {
  if (!text) {
    return null;
  }

  const trimmedText = text.replace(/(\r\n|\n|\r)/gm, "").trim();
  const links = trimmedText.match(/\[\[.+?\]\]/g) || [];
  const transformedLinks = links.map(function(link) {
    var differentName = link.match(/\[\[(.*?)\->(.*?)\]\]/);

    if (differentName) {
      return {
        __typename: "EmbarkLink",
        label: differentName[1],
        name: differentName[2]
      };
    } else {
      link = link.substring(2, link.length - 2);
      return {
        __typename: "EmbarkLink",
        name: link,
        label: link
      };
    }
  });

  return transformedLinks;
};
