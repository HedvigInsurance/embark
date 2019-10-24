const parseLinks = (text: string) => {
    const trimmedText = text.replace(/(\r\n|\n|\r)/gm,"").trim()
    const links = trimmedText.match(/\[\[.+?\]\]/g) || []
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

    return transformedLinks
}

const getSelectAction = (actionNode: Element | undefined) => {
    if (!actionNode) {
        return null
    }

    const actionNodeOptions = Array.from(actionNode.getElementsByTagName("option")).map(option => {
        const links = parseLinks(option.textContent)
        
        const key = option.attributes["key"]
        const value = option.attributes["value"]

        return {
            key: key ? key.value : null,
            value: value ? value.value : null,
            link: links[0]
        }
    })

    return {
        component: "SelectAction",
        data: {
            options: actionNodeOptions
        }
    }
}

const getNumberAction = (numberActionNode: Element) => {
    const placeholder = numberActionNode.attributes["placeholder"].value
    const next = numberActionNode.attributes["next"].value
    const key = numberActionNode.attributes["key"].value

    const links = parseLinks(next)

    return {
        component: "NumberAction",
        data: {
            placeholder,
            key,
            link: links[0]
        }
    }
}

const getAction = (containerElement: Element) => {
    const selectActionNode = containerElement.getElementsByTagName("selectaction")[0]

    if (selectActionNode) {
        return getSelectAction(selectActionNode)
    }

    const numberActionNode = containerElement.getElementsByTagName("numberaction")[0]

    if (numberActionNode) {
        return getNumberAction(numberActionNode)
    }

    return null
}

const getResponse = (containerElement: Element) => {
    const responseNode = containerElement.getElementsByTagName("response")[0]

    if (responseNode) {
        const text = responseNode.textContent

        return {
            text
        }
    }

    return null
}

export const parseStoryData = (storyData: any) => (
    {
        name: storyData.name,
        startPassage: storyData.startPassage,
        passages: storyData.passages.map(passage => {
            var containerElement = document.createElement("div")
            containerElement.innerHTML = passage.text
        
            const messages = Array.from(containerElement.getElementsByTagName("message")).map(message => {
                const delay = message.attributes["delay"]
        
                return {
                    text: message.textContent,
                    delay: delay ? delay : 0
                }
            })
        
            return {
                id: passage.id,
                text: passage.text,
                name: passage.name,
                messages: messages,
                action: getAction(containerElement),
                response: getResponse(containerElement)
            }
        }),
    }
)