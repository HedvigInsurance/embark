import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import { SelectOption, SelectOptionProps } from './SelectOption'

export default {
  title: 'Components/Actions/SelectOption',
  component: SelectOption,
  argTypes: { onClick: { action: 'on click' } },
  parameters: { layout: 'centered' },
} as Meta

const Template: Story<SelectOptionProps> = (args) => <SelectOption {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Apartment',
  isTransitioning: false,
  tooltip: {
    title: 'Apartment',
    description: 'For those of you who rent or own an apartment',
  },
}
