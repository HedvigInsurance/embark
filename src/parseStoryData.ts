const getAction = (actionNode: Element | undefined) => {
    if (!actionNode) {
        return null
    }

    const actionNodeOptions = Array.from(actionNode.getElementsByTagName("option")).map(option => {
        const text = option.textContent.replace(/(\r\n|\n|\r)/gm,"").trim()
        const links = text.match(/\[\[.+?\]\]/g) || []
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

        if (transformedLinks.length > 1 || transformedLinks.length == 0) {
            throw "has no links"
        }

        const key = option.attributes["key"]
        const value = option.attributes["value"]

        return {
            key: key ? key.value : null,
            value: value ? value.value : null,
            link: transformedLinks[0]
        }
    })

    return {
        component: "SelectAction",
        options: actionNodeOptions
    }
},


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
        
            const actionNode = containerElement.getElementsByTagName("selectaction")[0]
        
            return {
                id: passage.id,
                text: passage.text,
                name: passage.name,
                messages: messages,
                action: getAction(actionNode)
            }
        }),
    }
)