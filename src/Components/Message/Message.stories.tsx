import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import { Message, MessageProps } from './Message'

export default {
  title: 'Components/Message',
  component: Message,
} as Meta

const message = {
  expressions: [],
  text:
    'Great! Now we need your swedish personal number so that we can automatically fetch information about your house',
}

const messageLink = {
  expressions: [],
  text:
    'By proceeding I confirm that I understand that my personal data is handled according to [GDPR](https://www.hedvig.com/se-en/privacy)',
}

const Template: Story<MessageProps> = (args) => <Message {...args} />

export const Default = Template.bind({})
Default.args = {
  isResponse: false,
  message: message,
}

export const MessageWithLink = Template.bind({})
MessageWithLink.args = {
  isResponse: false,
  message: messageLink,
}
