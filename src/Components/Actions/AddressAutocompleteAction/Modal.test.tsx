/**
 * @jest-environment jsdom
 */

import * as React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Modal from './Modal'

describe('address autocomplete modal', () => {
  test('modal toggles display of children', async () => {
    // Arrange
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

    // Act
    const { getByText } = render(<ModalWithButton />)

    // Assert
    expect(getByText('close')).not.toBeVisible()

    // Act
    userEvent.click(getByText('open'))

    // Assert
    await waitFor(() => {
      expect(getByText('close')).toBeVisible()
    })

    // Act
    userEvent.click(getByText('close'))

    // Assert
    await waitFor(() => {
      expect(getByText('close')).not.toBeVisible()
    })
  })

  test('modal responds to pressing escape', () => {
    // Arrange
    const handleDismiss = jest.fn()

    // Act
    render(<Modal isOpen={true} onDismiss={handleDismiss} />)
    userEvent.keyboard('{Escape}')

    // Assert
    expect(handleDismiss).toHaveBeenCalledTimes(1)
  })

  test('modal responds to click outside', () => {
    // Arrange
    const handleDismiss = jest.fn()

    // Act
    const { getByText } = render(
      <div>
        <div>outside</div>

        <Modal isOpen={true} onDismiss={handleDismiss}>
          <div>inside</div>
        </Modal>
      </div>,
    )

    // Act
    userEvent.click(getByText('inside'))

    // Assert
    expect(handleDismiss).toHaveBeenCalledTimes(0)

    // Act
    userEvent.click(getByText('outside'))

    // Assert
    expect(handleDismiss).toHaveBeenCalledTimes(1)
  })
})
