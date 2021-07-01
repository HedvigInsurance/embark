import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colorsV3 } from '@hedviginsurance/brand'
import styled from '@emotion/styled'

const StyledOverlay = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background: rgba(0, 0, 0, 0.6);
`

const StyledModal = styled(motion.div)`
  background: ${colorsV3.white};

  flex: 1;
  height: 100%;
  max-width: 600px;

  display: flex;
  flex-direction: column;

  @media (min-width: 600px) {
    border-radius: 8px;
    overflow: hidden;
    max-height: 600px;
  }
`

interface Props {
  isOpen: boolean
  onDismiss: () => void
}

const Modal: React.FC<Props> = ({ children, isOpen, onDismiss }) => {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onDismiss()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener(`touchstart`, handleClickOutside)
    }
  }, [ref, onDismiss])

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onDismiss])

  React.useEffect(() => {
    // Prevent background from scrolling behind modal
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'initial'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen ? (
        <StyledOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <StyledModal
            ref={ref}
            role="dialog"
            aria-modal={true}
            initial={{ translateY: 56 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 56 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {children}
          </StyledModal>
        </StyledOverlay>
      ) : null}
    </AnimatePresence>
  )
}

export default Modal
