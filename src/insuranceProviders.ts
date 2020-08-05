export interface Icon {
  vectorDrawableUrl: string
  pdfUrl: string
  svgUrl: string
  variants: {
    dark: {
      vectorDrawableUrl: string
      pdfUrl: string
      svgUrl: string
    }
    light: {
      vectorDrawableUrl: string
      pdfUrl: string
      svgUrl: string
    }
  }
}

export interface InsuranceProvider {
  id: string
  name: string
  externalCollectionId?: string
  hasExternalCapabilities: boolean
  icon: Icon
}

const getIcon = (name: String): Icon => {
  const base = '/embark/providers/'
  return {
    vectorDrawableUrl: `${base}${name}.xml`,
    pdfUrl: `${base}${name}.pdf`,
    svgUrl: `${base}${name}.svg`,
    variants: {
      dark: {
        vectorDrawableUrl: `${base}${name}_dark.xml`,
        pdfUrl: `${base}${name}_dark.pdf`,
        svgUrl: `${base}${name}_dark.svg`,
      },
      light: {
        vectorDrawableUrl: `${base}${name}.xml`,
        pdfUrl: `${base}${name}.pdf`,
        svgUrl: `${base}${name}.svg`,
      },
    },
  }
}

export const swedishProviders: ReadonlyArray<InsuranceProvider> = [
  {
    id: 'if',
    externalCollectionId: 'IF',
    name: 'If',
    hasExternalCapabilities: true,
    icon: getIcon('if'),
  },
  {
    id: 'Trygg-Hansa',
    externalCollectionId: 'TRYGGHANSA',
    name: 'Trygg Hansa',
    hasExternalCapabilities: true,
    icon: getIcon('trygg-hansa'),
  },
  {
    id: 'Folksam',
    externalCollectionId: 'FOLKSAM',
    name: 'Folksam',
    hasExternalCapabilities: true,
    icon: getIcon('folksam'),
  },
  {
    id: 'Länsförsäkringar',
    externalCollectionId: 'LANSFORSAKRINGAR',
    name: 'Länsförsäkringar',
    hasExternalCapabilities: true,
    icon: getIcon('lansforsakringar'),
  },
  {
    id: 'Länsförsäkringar Stockholm',
    externalCollectionId: 'LANSFORSAKRINGAR_STOCKHOLM',
    name: 'Länsförsäkringar Stockholm',
    hasExternalCapabilities: true,
    icon: getIcon('lansforsakringar'),
  },
  {
    id: 'Moderna',
    externalCollectionId: 'MODERNA',
    name: 'Moderna',
    hasExternalCapabilities: true,
    icon: getIcon('moderna'),
  },
  {
    id: 'Gjensidige',
    name: 'Gjensidige',
    hasExternalCapabilities: false,
    icon: getIcon('gjensidige'),
  },
  {
    id: 'Dina Försäkringar',
    externalCollectionId: 'DINA',
    name: 'Dina Försäkringar',
    hasExternalCapabilities: true,
    icon: getIcon('dina-forsakringar'),
  },
  {
    id: 'Vardia',
    name: 'Vardia',
    hasExternalCapabilities: false,
    icon: getIcon('vardia'),
  },
  {
    id: 'ICA',
    name: 'ICA Försäkring',
    hasExternalCapabilities: false,
    icon: getIcon('ica'),
  },
  {
    id: 'Tre Kronor',
    name: 'Tre Kronor',
    hasExternalCapabilities: true,
    icon: getIcon('tre-kronor'),
  },
  {
    id: 'Aktsam',
    externalCollectionId: 'AKTSAM',
    name: 'Aktsam',
    hasExternalCapabilities: false,
    icon: getIcon('aktsam'),
  },
]

export const norwegianProviders: ReadonlyArray<InsuranceProvider> = [
  {
    name: 'Fremtind',
    id: 'Fremtind',
    hasExternalCapabilities: false,
    icon: getIcon('fremtind'),
  },
  {
    name: 'If',
    id: 'If NO',
    hasExternalCapabilities: false,
    icon: getIcon('if'),
  },
  {
    name: 'Gjensidige',
    id: 'Gjensidige NO',
    hasExternalCapabilities: false,
    icon: getIcon('gjensidige'),
  },
  {
    name: 'Tryg',
    id: 'Tryg',
    hasExternalCapabilities: false,
    icon: getIcon('trygg-hansa'),
  },
  {
    name: 'Eika',
    id: 'Eika',
    hasExternalCapabilities: false,
    icon: getIcon('eika'),
  },
  {
    name: 'Frende',
    id: 'Frende',
    hasExternalCapabilities: false,
    icon: getIcon('frende'),
  },
  {
    name: 'Storebrand',
    id: 'Storebrand',
    hasExternalCapabilities: false,
    icon: getIcon('storebrand'),
  },
  {
    name: 'Codan',
    id: 'Codan',
    hasExternalCapabilities: false,
    icon: getIcon('codan'),
  },
]
