import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import { TextAction, TextActionProps } from './TextAction'

export default {
  title: 'Components/Actions/TextAction',
  component: TextAction,
  argTypes: { onContinue: { action: 'on continue' } },
  parameters: { layout: 'centered' },
} as Meta

const Template: Story<TextActionProps> = (args) => <TextAction {...args} />

export const Email = Template.bind({})
Email.args = {
  isTransitioning: false,
  passageName: 'emailAdressApartment',
  mask: 'Email',
  storeKey: 'email',
  placeholder: 'din.epost@här.nu',
  tooltip: {
    title: 'Tooltip title',
    description: 'Ange din email',
  },
}

export const PersonalNumber = Template.bind({})
PersonalNumber.args = {
  isTransitioning: false,
  passageName: 'personalNumberApartment',
  mask: 'PersonalNumber',
  storeKey: 'personalNumber',
export const BirthDate = Template.bind({})
BirthDate.args = {
  isTransitioning: false,
  passageName: 'birthDate',
  mask: 'BirthDate',
  storeKey: 'birthDate',
  placeholder: 'yyyy-mm-dd',
}

export const BirthDateReverse = Template.bind({})
BirthDateReverse.args = {
  isTransitioning: false,
  passageName: 'birthDate',
  mask: 'BirthDateReverse',
  storeKey: 'birthDate',
  placeholder: 'dd-mm-yyyy',
}
