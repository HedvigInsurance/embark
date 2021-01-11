import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import { BackButton, BackButtonProps } from './BackButton'

export default {
  title: 'BackButton',
  component: BackButton,
  argTypes: { onClick: { action: 'clicked' } },
} as Meta

const Template: Story<BackButtonProps> = (args) => <BackButton {...args} />

export const Default = Template.bind({})
