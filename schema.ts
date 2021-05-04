import axios from 'axios'
import { storyKeywords } from './src/storyKeywords'
import { makeExecutableSchema } from 'graphql-tools'
import { promises } from 'fs'
import { parseStoryData } from './src/Parsing/parseStoryData'
import { resolveMetadataOnLocale } from './src/Resolvers/resolveStoriesMetadata'

const typeDefs = `
    type Query {
        embarkStory(name: String!, locale: String!): EmbarkStory
        # returns names of all available embark stories
        embarkStoryNames: [String!]!
        embarkStories(locale: String!): [EmbarkStoryMetadata!]!
    }

    type EmbarkKeywords {
        ${Object.keys(storyKeywords).map((key) => `${key}: String`)}
    }

    type EmbarkComputedStoreValue {
      key: String!
      value: String!
    }

    enum EmbarkPartnerConfigAlignment {
        center
        left
    }

    type EmbarkPartnerConfig {
        alignment: EmbarkPartnerConfigAlignment!
        image: String!
        isDefault: Boolean!
        name: String!
    }

    type EmbarkLink {
        name: String!
        label: String!
    }

    interface EmbarkApiCore {
        component: String!
    }

    enum EmbarkAPIGraphQLSingleVariableCasting {
        string
        int
        boolean
    }

    type EmbarkAPIGraphQLSingleVariable {
        key: String!
        from: String!
        as: EmbarkAPIGraphQLSingleVariableCasting!
    }

    enum EmbarkAPIGraphQLVariableGeneratedType {
        uuid
    }

    type EmbarkAPIGraphQLGeneratedVariable {
        key: String!
        storeAs: String!
        type: EmbarkAPIGraphQLVariableGeneratedType!
    }

    union EmbarkAPIGraphQLVariable = EmbarkAPIGraphQLSingleVariable | EmbarkAPIGraphQLGeneratedVariable | EmbarkAPIGraphQLMultiActionVariable

    type EmbarkAPIGraphQLMultiActionVariable {
        key: String!
        variables: [EmbarkAPIGraphQLVariable!]!
    }

    type EmbarkAPIGraphQLError {
        contains: String
        next: EmbarkLink!
    }

    type EmbarkAPIGraphQLResult {
        key: String!
        as: String!
    }

    type EmbarkApiGraphQLQueryData {
        next: EmbarkLink
        query: String!
        variables: [EmbarkAPIGraphQLVariable!]!
        errors: [EmbarkAPIGraphQLError!]!
        results: [EmbarkAPIGraphQLResult!]!
    }

    type EmbarkApiGraphQLQuery {
        component: String!
        data: EmbarkApiGraphQLQueryData!
    }

    type EmbarkApiGraphQLMutationData {
        next: EmbarkLink
        mutation: String!
        variables: [EmbarkAPIGraphQLVariable!]!
        errors: [EmbarkAPIGraphQLError!]!
        results: [EmbarkAPIGraphQLResult]!
    }

    type EmbarkApiGraphQLMutation {
        component: String!
        data: EmbarkApiGraphQLMutationData!
    }

    type EmbarkApiPersonalInformationData {
        match: EmbarkLink!
        noMatch: EmbarkLink!
        error: EmbarkLink!
    }

    type EmbarkApiPersonalInformation implements EmbarkApiCore {
        component: String!
        data: EmbarkApiPersonalInformationData!
    }

    type EmbarkApiHouseInformationData {
        match: EmbarkLink!
        noMatch: EmbarkLink!
        error: EmbarkLink!
    }

    type EmbarkApiHouseInformation implements EmbarkApiCore {
        component: String!
        data: EmbarkApiHouseInformationData!
    }

    type EmbarkApiCreateQuoteData {
        uwlimits: EmbarkLink!
        success: EmbarkLink!
        error: EmbarkLink!
    }

    type EmbarkApiCreateQuote implements EmbarkApiCore {
        component: String!
        data: EmbarkApiCreateQuoteData!
    }

    union EmbarkApi = EmbarkApiPersonalInformation | EmbarkApiHouseInformation | EmbarkApiCreateQuote | EmbarkApiGraphQLQuery | EmbarkApiGraphQLMutation

    type EmbarkExternalRedirect {
        component: String!
        data: EmbarkExternalRedirectData!
    }

    type EmbarkExternalRedirectData {
        location: EmbarkExternalRedirectLocation!
    }

    type EmbarkOfferRedirect {
        component: String!
        data: EmbarkOfferRedirectData!
    }

    type EmbarkOfferRedirectData {
        keys: [String!]!
    }

    enum EmbarkExternalRedirectLocation {
        MailingList
        Offer
    }

    interface EmbarkActionCore {
        component: String!
    }

    type EmbarkNumberActionSetData {
        link: EmbarkLink!
        numberActions: [EmbarkNumberActionSetNumberAction!]!
    }

    type EmbarkNumberActionSetNumberAction {
        data: EmbarkNumberActionSetNumberActionData
    }

    type EmbarkNumberActionSetNumberActionData {
        key: String!
        placeholder: String!
        unit: String
        label: String
        maxValue: Int
        minValue: Int
        title: String!
    }

    type EmbarkNumberActionSet implements EmbarkActionCore {
        component: String!
        data: EmbarkNumberActionSetData
    }

    type EmbarkTextActionSetTextAction {
        data: EmbarkTextActionSetTextActionData
    }

    type EmbarkTextActionSetTextActionData {
        placeholder: String!
        key: String!
        api: EmbarkApi
        large: Boolean
        mask: String
        tooltip: EmbarkTooltip
        title: String!
    }

    type EmbarkTextActionSetData {
        link: EmbarkLink!
        api: EmbarkApi
        textActions: [EmbarkTextActionSetTextAction!]!
    }

    type EmbarkTextActionSet implements EmbarkActionCore {
        component: String!
        data: EmbarkTextActionSetData
    }

    type EmbarkTextActionData {
        placeholder: String!
        key: String!
        api: EmbarkApi
        link: EmbarkLink!
        large: Boolean
        mask: String
        tooltip: EmbarkTooltip
    }

    type EmbarkTextAction implements EmbarkActionCore {
        component: String!
        data: EmbarkTextActionData!
    }

    type EmbarkSelectActionOption {
        keys: [String!]!
        values: [String!]!

        link: EmbarkLink!
        tooltip: EmbarkTooltip
        api: EmbarkApi
    }

    type EmbarkSelectActionData {
        options: [EmbarkSelectActionOption!]!
    }

    type EmbarkSelectAction implements EmbarkActionCore {
        component: String!
        data: EmbarkSelectActionData!
    }

    type EmbarkNumberActionData {
        key: String!
        placeholder: String!
        unit: String
        label: String
        maxValue: Int
        minValue: Int
        link: EmbarkLink!
    }

    type EmbarkExternalInsuranceProviderActionData {
        next: EmbarkLink!
        skip: EmbarkLink!
    }

    type EmbarkExternalInsuranceProviderAction implements EmbarkActionCore {
        component: String!
        data: EmbarkExternalInsuranceProviderActionData!
    }

    enum EmbarkPreviousInsuranceProviderActionDataProviders {
        NORWEGIAN
        SWEDISH
    }

    type EmbarkPreviousInsuranceProviderActionData {
        next: EmbarkLink!
        skip: EmbarkLink!
        providers: EmbarkPreviousInsuranceProviderActionDataProviders
        storeKey: String!
        tooltip: EmbarkTooltip
    }

    type EmbarkPreviousInsuranceProviderAction implements EmbarkActionCore {
        component: String!
        data: EmbarkPreviousInsuranceProviderActionData!
    }

    type EmbarkNumberAction implements EmbarkActionCore {
        component: String!
        data: EmbarkNumberActionData!
    }

    type EmbarkMultiActionData {
        key: String
        addLabel: String
        maxAmount: String!
        link: EmbarkLink!
        components: [EmbarkMultiActionComponent!]!
    }

    type EmbarkMultiAction implements EmbarkActionCore {
        component: String!
        data: EmbarkMultiActionData!
    }
    
    type EmbarkDatePickerAction implements EmbarkActionCore {
        component: String!       
        next: EmbarkLink!
        storeKey: String!
        label: String!
        tooltip: EmbarkTooltip
    }

    type EmbarkDropdownOption {
        value: String!
        text: String!
    }

    type EmbarkDropdownActionData {
        label: String!
        key: String!
        options: [EmbarkDropdownOption!]!
    }

    type EmbarkDropdownAction implements EmbarkActionCore {
        component: String!
        data: EmbarkDropdownActionData!
    }

    type EmbarkSwitchActionData {
        label: String!
        key: String!
        defaultValue: Boolean!
    }

    type EmbarkSwitchAction implements EmbarkActionCore {
        component: String!
        data: EmbarkSwitchActionData!
    }

    union EmbarkAction = EmbarkExternalInsuranceProviderAction | 
        EmbarkPreviousInsuranceProviderAction | 
        EmbarkNumberActionSet | 
        EmbarkTextActionSet | 
        EmbarkTextAction | 
        EmbarkSelectAction | 
        EmbarkNumberAction | 
        EmbarkMultiAction |
        EmbarkDatePickerAction

    union EmbarkMultiActionComponent = EmbarkNumberAction | EmbarkDropdownAction | EmbarkSwitchAction

    type EmbarkGroupedResponseEach {
        key: String!
        content: EmbarkMessage!
    }

    type EmbarkGroupedResponse {
        component: String!
        title: EmbarkResponseExpression!
        items: [EmbarkMessage!]!
        each: [EmbarkGroupedResponseEach!]!
    }

    type EmbarkResponseExpression {
        text: String!
        expressions: [EmbarkExpression!]!
    }

    # Returning EmbarkMessage from EmbarkResponse is deprecated and will be removed in a future version.
    union EmbarkResponse = EmbarkGroupedResponse | EmbarkResponseExpression | EmbarkMessage

    type EmbarkTooltip {
        title: String!
        description: String!
    }

    type EmbarkPassage {
        id: String!
        text: String!
        name: String!
        url: String
        allLinks: [EmbarkLink!]!
        api: EmbarkApi
        messages: [EmbarkMessage!]!
        externalRedirect: EmbarkExternalRedirect
        offerRedirect: EmbarkOfferRedirect
        action: EmbarkAction
        response: EmbarkResponse!
        tooltips: [EmbarkTooltip!]!
        tracks: [EmbarkTrack!]!
        redirects: [EmbarkRedirect!]!
    }

    type EmbarkTrack {
        eventName: String!
        eventKeys: [String]!
        includeAllKeys: Boolean!
        customData: JSONString
    }

    enum EmbarkExpressionTypeMultiple {
        AND
        OR
    }

    enum EmbarkExpressionTypeBinary {
        EQUALS
        NOT_EQUALS
        MORE_THAN
        LESS_THAN
        MORE_THAN_OR_EQUALS
        LESS_THAN_OR_EQUALS
    }

    enum EmbarkExpressionTypeUnary {
        ALWAYS
        NEVER
    }

    union EmbarkExpression = EmbarkExpressionUnary | EmbarkExpressionBinary | EmbarkExpressionMultiple

    type EmbarkExpressionUnary {
        type: EmbarkExpressionTypeUnary!
        text: String
    }

    type EmbarkExpressionBinary {
        type: EmbarkExpressionTypeBinary!
        key: String!
        value: String!
        text: String
    }

    type EmbarkExpressionMultiple {
        type: EmbarkExpressionTypeMultiple!
        text: String
        subExpressions: [EmbarkExpression!]!
    }

    union EmbarkRedirect = EmbarkRedirectUnaryExpression | EmbarkRedirectBinaryExpression | EmbarkRedirectMultipleExpressions

    type EmbarkRedirectUnaryExpression {
        type: EmbarkExpressionTypeUnary!
        to: String!
        passedExpressionKey: String
        passedExpressionValue: String
    }

    type EmbarkRedirectBinaryExpression {
        type: EmbarkExpressionTypeBinary!
        to: String!
        key: String!
        value: String!
        passedExpressionKey: String
        passedExpressionValue: String
    }

    type EmbarkRedirectMultipleExpressions {
        type: EmbarkExpressionTypeMultiple!,
        to: String!
        subExpressions: [EmbarkExpression!]!
        passedExpressionKey: String
        passedExpressionValue: String
    }

    type EmbarkMessage {
        expressions: [EmbarkExpression!]!
        text: String!
    }

    type EmbarkStory {
        id: String!
        startPassage: String!
        name: String!
        keywords: EmbarkKeywords!
        computedStoreValues: [EmbarkComputedStoreValue!]
        partnerConfigs: [EmbarkPartnerConfig!]!
        passages: [EmbarkPassage!]!
        trackableProperties: [String!]!
    }

    type EmbarkStoryMetadata {
      name: String!
      type: EmbarkStoryType!
      """Localized"""
      title: String!
      """Localized"""
      description: String!
      metadata: [EmbarkStoryMetadataEntry!]!
    }

    union EmbarkStoryMetadataEntry = 
      EmbarkStoryMetadataEntryDiscount | 
      EmbarkStoryMetaDataEntryWebUrlPath |
      EmbarkStoryMetadataEntryPill |
      EmbarkStoryMetadataEntryBackground

    type EmbarkStoryMetadataEntryDiscount {
      discount: String! @deprecated(reason: "Use \`EmbarkStoryMetadataEntryPill\`.")
    }

    type EmbarkStoryMetaDataEntryWebUrlPath {
        path: String!
    }

    enum EmbarkStoryType {
      WEB_ONBOARDING
      APP_ONBOARDING
    }
    
    type EmbarkStoryMetadataEntryPill {
      """Localized"""
      pill: String! 
    }
    
    type EmbarkStoryMetadataEntryBackground {
      background: EmbarkStoryMetadataEntryBackgroundOption!
    }
    
    enum EmbarkStoryMetadataEntryBackgroundOption {
      GRADIENT_ONE
      GRADIENT_TWO
      GRADIENT_THREE
    }

    scalar JSONString
`

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      embarkStory: async (
        _,
        { name, locale }: { name: string; locale: string },
      ) => {
        const dir = await promises.readdir('angel-data')

        if (!dir.includes(`${name}.json`)) {
          throw new Error(`Can't find story with name: ${name}`)
        }

        const file = await promises.readFile(`angel-data/${name}.json`, {
          encoding: 'utf-8',
        })

        const json = JSON.parse(file)
        const textKeyMapResponse = await axios.get(
          `https://translations.hedvig.com/embark/${encodeURIComponent(
            locale,
          )}.json`,
        )
        const storyData = parseStoryData(json, textKeyMapResponse.data)

        return storyData
      },
      embarkStories: async (_, { locale }: { locale: string }) => {
        const textKeyMapResponse = await axios.get(
          `https://translations.hedvig.com/embark/${encodeURIComponent(
            locale,
          )}.json`,
        )
        const metadata = await resolveMetadataOnLocale(
          locale,
          textKeyMapResponse.data,
        )
        return metadata
      },
      embarkStoryNames: async () => {
        const dirs = await promises.readdir('angel-data')
        return dirs.map((name) => name.replace('.json', ''))
      },
    },
  },
})
