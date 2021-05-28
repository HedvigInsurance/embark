import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import {
  AutocompleteAction,
  AutocompleteActionProps,
} from './AutocompleteAction'

export default {
  title: 'Components/Actions/AutocompleteAction',
  component: AutocompleteAction,
  argTypes: { onContinue: { action: 'on continue' } },
  parameters: { layout: 'centered' },
} as Meta

const Template: Story<AutocompleteActionProps> = (args) => (
  <AutocompleteAction {...args} />
)

export const Autocomplete = Template.bind({})
Autocomplete.args = {
  isTransitioning: false,
  passageName: 'autocomplete',
  storeKey: 'address',
  placeholder: 'Teststreet 12',
}
