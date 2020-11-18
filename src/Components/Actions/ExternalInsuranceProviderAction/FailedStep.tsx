import * as React from 'react'
import styled from '@emotion/styled'
import { fonts } from '@hedviginsurance/brand'
import { ContinueButton } from '../../ContinueButton'
import { KeywordsContext } from '../../KeywordsContext'

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 30px 20px;
  width: 350px;
`

const Title = styled.h3`
  font-family: ${fonts.FAVORIT};
  margin-bottom: 10px;
  text-align: center;
`

const Body = styled.p`
  font-family: ${fonts.FAVORIT};
  margin-bottom: 15px;
  text-align: center;
`

interface FailedStepProps {
  onRetry: () => void
}

export const FailedStep: React.FC<FailedStepProps> = ({ onRetry }) => {
  const {
    externalInsuranceProviderFailureTitle,
    externalInsuranceProviderFailureMessage,
    externalInsuranceProviderFailureButton,
  } = React.useContext(KeywordsContext)

  return (
    <Container>
      <Title>{externalInsuranceProviderFailureTitle}</Title>
      <Body>{externalInsuranceProviderFailureMessage}</Body>
      <ContinueButton
        disabled={false}
        text={externalInsuranceProviderFailureButton}
        onClick={onRetry}
      />
    </Container>
  )
}
