export const getFirstLevelNodes = (node: Element) =>
  Array.from(node.childNodes).filter((child) => child.nodeType === 1)

export const parseLinks = (text: string) => {
  if (!text) {
    return null
  }

  const trimmedText = text.replace(/(\r\n|\n|\r)/gm, '').trim()
  const links = trimmedText.match(/\[\[.+?\]\]/g) || []
  return links.map((link) => {
    const differentName = link.match(/\[\[(.*?)\->(.*?)\]\]/)

    if (differentName) {
      return {
        __typename: 'EmbarkLink',
        label: differentName[1],
        name: differentName[2],
      }
    } else {
      const actualLink = link.substring(2, link.length - 2)
      return {
        __typename: 'EmbarkLink',
        name: actualLink,
        label: actualLink,
      }
    }
  })
}
