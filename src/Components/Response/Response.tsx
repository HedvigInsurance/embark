import * as React from 'react'
import styled from '@emotion/styled'
import { Message } from '../Message/Message'
import { ExpressionTextNode } from '../Common'
import { GroupedResponse as GroupedResponseComponent } from './GroupedResponse'

const ResponseAlignment = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

type Response = ExpressionTextNode | GroupedResponse

interface GroupedResponse {
  component: string
  title: ExpressionTextNode
  items: ExpressionTextNode[]
  each?: {
    key: string
    content: ExpressionTextNode
  }
}

type ResponseProps = {
  response: ExpressionTextNode
}

const isGroupedResponse = (response: Response): response is GroupedResponse => {
  return 'component' in response && response.component === 'GroupedResponse'
}

export const Response = (props: ResponseProps) => {
  if (isGroupedResponse(props.response)) {
    return (
      <ResponseAlignment>
        <GroupedResponseComponent
          title={props.response.title}
          items={props.response.items}
          each={props.response.each}
        />
      </ResponseAlignment>
    )
  }
  return (
    <ResponseAlignment>
      <Message isResponse={true} message={props.response} />
    </ResponseAlignment>
  )
}
