import * as React from 'react'
import { colorsV2, fonts } from '@hedviginsurance/brand'
import styled from '@emotion/styled'
import { Input } from '../Common'
import { evalTemplateString } from '../../Common'
import { isValid, wrapWithMask } from '../masking'
import { Provider } from './providers'
import { KeywordsContext } from '../../KeywordsContext'
import { ContinueButton } from '../../ContinueButton'
import { BackButton } from './Components/BackButton'

const Container = styled.div`
  padding: 20px;
  box-sizing: border-box;
  width: 400px;
`

const PersonalNumberInput = wrapWithMask(Input)

const InputContainer = styled.div`
  border: 1px solid ${colorsV2.lightgray};
  border-radius: 8px;
  padding: 10px;

  input {
    width: 100%;
    margin: 0;
    padding: 0px 15px;
    box-sizing: border-box;
    font-size: 40px;

    &::placeholder {
      font-size: 40px;
    }
  }
`

const ButtonContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`

const Title = styled.h3`
  display: flex;
  align-items: center;
  font-family: ${fonts.FAVORIT};
  margin-bottom: 5px;
`

const BetaInfo = styled.p`
  font-family: ${fonts.FAVORIT};
  color: ${colorsV2.darkgray};
  font-size: 12px;
  margin-bottom: 15px;
`

const Subtitle = styled.h4`
  display: flex;
  align-items: center;
  font-family: ${fonts.FAVORIT};
  margin-bottom: 10px;
`

interface PersonalNumberProps {
  provider: Provider
  onCancel: () => void
  onContinue: (personalNumber: string) => void
}

export const PersonalNumber: React.FC<PersonalNumberProps> = ({
  onCancel,
  onContinue,
  provider,
}) => {
  const [value, setValue] = React.useState('')
  const {
    externalInsuranceProviderPersonalNumberTitle,
    externalInsuranceProviderPersonalNumberSubtitle,
    externalInsuranceProviderContinueButton,
    externalInsuranceProviderBETATag,
  } = React.useContext(KeywordsContext)

  return (
    <Container>
      <BackButton onClick={onCancel} />
      <Title>
        {provider.icon && provider.icon({ forceWidth: false })}
        {evalTemplateString(externalInsuranceProviderPersonalNumberTitle, {
          provider: provider.name,
        })}
      </Title>
      <BetaInfo>{externalInsuranceProviderBETATag}</BetaInfo>
      <Subtitle>{externalInsuranceProviderPersonalNumberSubtitle}</Subtitle>
      <InputContainer>
        <PersonalNumberInput
          placeholder="ååmmdd-xxxx"
          mask="PersonalNumber"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
        />
      </InputContainer>
      <ButtonContainer>
        <ContinueButton
          disabled={!isValid('PersonalNumber', value)}
          onClick={() => {
            onContinue(value)
          }}
          text={externalInsuranceProviderContinueButton}
        />
      </ButtonContainer>
    </Container>
  )
}
