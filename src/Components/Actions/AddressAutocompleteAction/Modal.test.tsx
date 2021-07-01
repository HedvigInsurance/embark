/**
 * @jest-environment jsdom
 */

import * as React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Modal from './Modal'

describe('address autocomplete modal', () => {
  test('modal toggles display of children', async () => {
    const ModalWithButton = () => {
      const [isOpen, setIsOpen] = React.useState(false)
      return (
        <div>
          <button onClick={() => setIsOpen(true)}>open</button>
          <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
            <button onClick={() => setIsOpen(false)}>close</button>
          </Modal>
        </div>
      )
    }

    const { getByText, queryByText } = render(<ModalWithButton />)

    expect(queryByText('close')).not.toBeInTheDocument()

    userEvent.click(getByText('open'))

    await waitFor(() => {
      expect(getByText('close')).toBeVisible()
    })

    userEvent.click(getByText('close'))

    await waitFor(() => {
      expect(getByText('close')).not.toBeVisible()
    })
  })

  test('modal responds to pressing escape', () => {
    const handleDismiss = jest.fn()

    render(<Modal isOpen={true} onDismiss={handleDismiss} />)
    userEvent.keyboard('{Escape}')

    expect(handleDismiss).toHaveBeenCalledTimes(1)
  })

  test('modal responds to click outside', () => {
    const handleDismiss = jest.fn()

    const { getByText } = render(
      <div>
        <div>outside</div>

        <Modal isOpen={true} onDismiss={handleDismiss}>
          <div>inside</div>
        </Modal>
      </div>,
    )

    userEvent.click(getByText('inside'))

    expect(handleDismiss).toHaveBeenCalledTimes(0)

    userEvent.click(getByText('outside'))

    expect(handleDismiss).toHaveBeenCalledTimes(1)
  })
})
