import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import {
  AddressAutocompleteAction,
  AddressAutocompleteActionProps,
} from './AddressAutocompleteAction'

export default {
  title: 'Components/Actions/AddressAutocompleteAction',
  component: AddressAutocompleteAction,
  argTypes: { onContinue: { action: 'on continue' } },
  parameters: { layout: 'centered' },
} as Meta

const Template: Story<AddressAutocompleteActionProps> = (args) => (
  <AddressAutocompleteAction {...args} />
)

export const Autocomplete = Template.bind({})
Autocomplete.args = {
  isTransitioning: false,
  passageName: 'autocomplete',
  storeKey: 'address',
  placeholder: 'Enter your home address',
}
