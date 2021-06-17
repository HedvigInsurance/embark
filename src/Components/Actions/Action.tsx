import * as React from 'react'
import { SelectAction } from './SelectAction/SelectAction'
import { NumberAction } from './NumberAction/NumberAction'
import { MultiAction } from './MultiAction/MultiAction'
import { TextAction } from './TextAction/TextAction'
import { NumberActionSet } from './NumberActionSet/NumberActionSet'
import { TextActionSet } from './TextActionSet/TextActionSet'
import { AddressAutocompleteAction } from './AddressAutocompleteAction/AddressAutocompleteAction'
import { ExternalInsuranceProviderAction } from './ExternalInsuranceProviderAction'
import { PreviousInsuranceProviderAction } from './PreviousInsuranceProviderAction'
import {
  norwegianProviders,
  swedishProviders,
} from './ExternalInsuranceProviderAction/providers'

type ActionProps = {
  isTransitioning: boolean
  passageName: string
  action: any
  changePassage: (name: string) => void
}

export const Action = (props: ActionProps) => {
  if (!props.action) {
    return null
  }

  if (props.action.component === 'TextActionSet') {
    return (
      <TextActionSet
        isTransitioning={props.isTransitioning}
        passageName={props.passageName}
        action={props.action}
        changePassage={props.changePassage}
        api={props.action.data.api}
      />
    )
  }

  if (props.action.component === 'NumberActionSet') {
    return (
      <NumberActionSet
        isTransitioning={props.isTransitioning}
        passageName={props.passageName}
        action={props.action}
        changePassage={props.changePassage}
      />
    )
  }

  if (props.action.component === 'MultiAction') {
    return (
      <MultiAction
        passageName={props.passageName}
        action={props.action}
        changePassage={props.changePassage}
      />
    )
  }

  if (props.action.component === 'SelectAction') {
    return (
      <SelectAction
        passageName={props.passageName}
        action={props.action}
        changePassage={props.changePassage}
      />
    )
  }

  if (props.action.component === 'NumberAction') {
    return (
      <NumberAction
        isTransitioning={props.isTransitioning}
        autoResultKey={props.passageName}
        mask={props.action.data.mask}
        tooltip={props.action.data.tooltip}
        storeKey={props.action.data.key}
        link={props.action.data.link}
        placeholder={props.action.data.placeholder}
        unit={props.action.data.unit}
        minValue={props.action.data.minValue}
        maxValue={props.action.data.maxValue}
        onContinue={() => props.changePassage(props.action.data.link.name)}
      />
    )
  }

  if (props.action.component === 'TextAction') {
    return (
      <TextAction
        isTransitioning={props.isTransitioning}
        passageName={props.passageName}
        mask={props.action.data.mask}
        tooltip={props.action.data.tooltip}
        storeKey={props.action.data.key}
        link={props.action.data.link}
        placeholder={props.action.data.placeholder}
        api={props.action.data.api}
        onContinue={(next?: string) =>
          props.changePassage(next || props.action.data.link.name)
        }
      />
    )
  }

  if (props.action.component === 'AddressAutocompleteAction') {
    return (
      <AddressAutocompleteAction
        isTransitioning={props.isTransitioning}
        passageName={props.passageName}
        tooltip={props.action.data.tooltip}
        storeKey={props.action.data.key}
        link={props.action.data.link}
        placeholder={props.action.data.placeholder}
        api={props.action.data.api}
        onContinue={(next?: string) =>
          props.changePassage(next || props.action.data.link.name)
        }
      />
    )
  }

  if (props.action.component === 'ExternalInsuranceProviderAction') {
    return (
      <ExternalInsuranceProviderAction
        skipLink={props.action.data.skip}
        next={props.action.data.next.name}
        onContinue={(next) => props.changePassage(next)}
        passageName={props.passageName}
      />
    )
  }

  if (props.action.component === 'PreviousInsuranceProviderAction') {
    return (
      <PreviousInsuranceProviderAction
        providers={
          props.action.data.providers === 'NORWEGIAN'
            ? norwegianProviders
            : swedishProviders
        }
        tooltip={props.action.data.tooltip}
        passageName={props.passageName}
        next={props.action.data.next.name}
        skipLink={props.action.data.skip}
        onContinue={(next) => props.changePassage(next)}
        storeKey={props.action.data.storeKey}
      />
    )
  }

  return null
}
