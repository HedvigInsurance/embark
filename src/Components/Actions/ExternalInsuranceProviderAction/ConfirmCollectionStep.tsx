import * as React from 'react'
import styled from '@emotion/styled'
import { fonts, colorsV3 } from '@hedviginsurance/brand'
import { ContinueButton } from '../../ContinueButton'
import { KeywordsContext } from '../../KeywordsContext'
import { BackButton } from './Components/BackButton'
import { replacePlaceholders } from '../../Common'
import { Provider } from './providers'

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 30px 20px;
  width: 350px;
  color: ${colorsV3.gray900};
`

const TextContainer = styled.div`
  text-align: center;
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

const Privacy = styled.p`
  font-family: ${fonts.FAVORIT};
  font-size: 12px;
  margin-top: 15px;
  text-align: center;
  color: ${colorsV3.gray500};
`

const PrivacyLink = styled.a`
  color: ${colorsV3.gray500};
`

const Spacer = styled.div`
  width: 10px;
`

const ButtonsContainer = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`

interface ConfirmCollectionStepProps {
  onAccept: () => void
  onReject: () => void
  onCancel: () => void
  provider: Provider
}

export const ConfirmCollectionStep: React.FC<ConfirmCollectionStepProps> = ({
  onAccept,
  onReject,
  onCancel,
  provider,
}) => {
  const {
    externalInsuranceProviderConfirmTitle,
    externalInsuranceProviderConfirmMessage,
    externalInsuranceProviderConfirmButton,
    externalInsuranceProviderConfirmRejectButton,
    externalInsuranceProviderConfirmPrivacyPolicy,
  } = React.useContext(KeywordsContext)

  return (
    <Container>
      <BackButton onClick={onCancel} />
      <TextContainer>
        <Title>
          {replacePlaceholders(
            { provider: provider.name },
            externalInsuranceProviderConfirmTitle,
          )}
        </Title>
        <Body>
          {replacePlaceholders(
            { provider: provider.name },
            externalInsuranceProviderConfirmMessage,
          )}
        </Body>
      </TextContainer>
      <ButtonsContainer>
        <ContinueButton
          disabled={false}
          text={externalInsuranceProviderConfirmButton}
          onClick={onAccept}
        />
        <Spacer />
        <ContinueButton
          disabled={false}
          text={externalInsuranceProviderConfirmRejectButton}
          onClick={onReject}
        />
      </ButtonsContainer>
      <Privacy>
        {replacePlaceholders(
          {
            provider: provider.name,
            privacyUrl: (
              <PrivacyLink href="https://hedvig.com/privacy" target="_blank">
                Privacy Policy
              </PrivacyLink>
            ),
          },
          externalInsuranceProviderConfirmPrivacyPolicy,
        )}
      </Privacy>
    </Container>
  )
}
