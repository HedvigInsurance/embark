import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import { NumberAction, NumberActionProps } from './NumberAction'

export default {
  title: 'Components/Actions/NumberAction',
  component: NumberAction,
  argTypes: { onContinue: { action: 'on continue' } },
  parameters: { layout: 'centered' },
} as Meta

const Template: Story<NumberActionProps> = (args) => <NumberAction {...args} />

export const HouseholdSize = Template.bind({})
HouseholdSize.args = {
  isTransitioning: false,
  link: {
    label: 'Fortsätt',
    name: 'personalNumberApartment',
  },
  mask: 'Email',
  minValue: '1',
  placeholder: '2',
  storeKey: 'householdSize',
  tooltip: {
    title: 'Antal försäkrade',
    description:
      'Exempelvis partner, barn eller roomies som ska täckas. De medförsäkrade måste bo tillsammans med dig för att täckas av din försäkring',
  },
  unit: 'personer (inkl. mig själv)',
}
