import * as React from 'react'

export interface TExternalRedirectContext {
  Offer: () => void
  MailingList: () => void
}

export const ExternalRedirectContext = React.createContext<
  TExternalRedirectContext
>({
  Offer: () => {
    throw Error(
      'Must provide an implementation for `ExternalRedirectContext.Offer`',
    )
  },
  MailingList: () => {
    throw Error(
      'Must provide an implementation for `ExternalRedirectContext.MailingList`',
    )
  },
})

interface ExternalRedirect {
  component: 'ExternalRedirect'
  data: {
    location: 'Offer' | 'MailingList'
  }
}
export const performExternalRedirect = (
  context: TExternalRedirectContext,
  externalRedirect: ExternalRedirect,
) => {
  if (externalRedirect.data.location === 'Offer') {
    context.Offer()
  }

  if (externalRedirect.data.location === 'MailingList') {
    context.MailingList()
  }
}
