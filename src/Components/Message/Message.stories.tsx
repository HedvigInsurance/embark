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
    'Okej! Då behöver vi bara ditt personnummer så kan vi automatiskt hämta resten av informationen som behövs för att ge dig ett pris',
}

const Template: Story<MessageProps> = (args) => <Message {...args} />

export const Default = Template.bind({})
Default.args = {
  isResponse: false,
  message: message,
}
