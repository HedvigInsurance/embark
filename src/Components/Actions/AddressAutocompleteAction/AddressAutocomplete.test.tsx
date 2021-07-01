/**
 * @jest-environment jsdom
 */

import * as React from 'react'
import { act, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import AddressAutocomplete from './AddressAutocomplete'
import { AddressSuggestion } from '../../API/addressAutocomplete'

describe('address autocomplete component', () => {
  test('idle state is properly setup', () => {
    const placeholder = 'home address'
    const handleDismiss = jest.fn()
    const handleChange = jest.fn()

    const { getByRole, getByPlaceholderText, getByText } = render(
      <AddressAutocomplete
        onDismiss={handleDismiss}
        onSelect={jest.fn()}
        onNotFound={jest.fn()}
        value=""
        onChange={handleChange}
        onClear={jest.fn()}
        placeholder={placeholder}
        suggestions={null}
      />,
    )

    // Input is automatically focused
    const inputElement = getByPlaceholderText(placeholder)
    expect(document.activeElement).toEqual(inputElement)

    const inputString = 'jakob'
    userEvent.type(inputElement, inputString)
    expect(handleChange).toHaveBeenCalledTimes(inputString.length)

    expect(getByRole('listbox').children.length).toEqual(0)

    act(() => {
      userEvent.click(getByText('Address Autocomplete - Modal Dismiss Button'))
    })
    expect(handleDismiss).toHaveBeenCalledTimes(1)
  })

  test('listing suggestions and selecting one of them', () => {
    const value = 'jakob bo'
    const suggestions: Array<AddressSuggestion> = [
      { address: 'Jakob Bondes Vej' },
      { address: 'Borgmester Jakob Jensens Gade' },
    ]
    const handleSelect = jest.fn()

    const { getAllByRole, getByText } = render(
      <AddressAutocomplete
        onDismiss={jest.fn()}
        onSelect={handleSelect}
        onNotFound={jest.fn()}
        value={value}
        onChange={jest.fn()}
        onClear={jest.fn()}
        placeholder=""
        suggestions={suggestions}
      />,
    )

    expect(getAllByRole('option').length).toEqual(suggestions.length + 1)

    act(() => {
      userEvent.keyboard('{arrowdown}{arrowdown}')
    })
    expect(getByText(suggestions[0].address).parentElement).toHaveAttribute(
      'aria-selected',
      'false',
    )
    expect(getByText(suggestions[1].address).parentElement).toHaveAttribute(
      'aria-selected',
      'true',
    )

    act(() => {
      userEvent.keyboard('{enter}')
    })
    expect(handleSelect).toHaveBeenCalledTimes(1)
    expect(handleSelect).toHaveBeenCalledWith(suggestions[1])
  })

  test('clearing the input text', () => {
    const handleClear = jest.fn()

    const { getByRole } = render(
      <AddressAutocomplete
        onDismiss={jest.fn()}
        onSelect={jest.fn()}
        onNotFound={jest.fn()}
        value="jakob bo"
        onChange={jest.fn()}
        onClear={handleClear}
        placeholder=""
        suggestions={null}
      />,
    )

    act(() => {
      userEvent.click(
        getByRole('combobox').querySelector('button') as HTMLButtonElement,
      )
    })

    expect(handleClear).toHaveBeenCalledTimes(1)
  })

  test('selecting the not found suggestion', () => {
    const suggestions: Array<AddressSuggestion> = [
      { address: 'Jakob Bondes Vej' },
      { address: 'Borgmester Jakob Jensens Gade' },
    ]
    const handleSelect = jest.fn()
    const handleNotFound = jest.fn()

    const { getByText } = render(
      <AddressAutocomplete
        onDismiss={jest.fn()}
        onSelect={handleSelect}
        onNotFound={handleNotFound}
        value=""
        onChange={jest.fn()}
        onClear={jest.fn()}
        placeholder=""
        suggestions={suggestions}
      />,
    )

    act(() => {
      userEvent.click(
        getByText('Address Autocomplete - Address Not Found Label'),
      )
    })
    expect(handleSelect).not.toHaveBeenCalled()
    expect(handleNotFound).toHaveBeenCalled()
  })
})
