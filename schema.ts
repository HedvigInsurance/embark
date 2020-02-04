import { storyKeywords } from "./src/storyKeywords";
import { makeExecutableSchema } from "graphql-tools";
import { promises } from "fs";
import { parseStoryData } from "./src/parseStoryData";

const typeDefs = `
    type Query {
        embarkStory(name: String!): EmbarkStory
    }

    type EmbarkKeywords {
        ${Object.keys(storyKeywords).map(key => `${key}: String`)}
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
        data: EmbarkApiHouseInformation!
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

    union EmbarkApi = EmbarkApiPersonalInformation | EmbarkApiHouseInformation | EmbarkApiCreateQuote

    enum EmbarkExternalRedirect {
        email
    }

    interface EmbarkActionCore {
        component: String!
    }

    type EmbarkNumberActionSetData {
        link: EmbarkLink!
    }

    type EmbarkNumberActionSet implements EmbarkActionCore {
        component: String!
        data: EmbarkNumberActionSetData
    }

    type EmbarkTextActionSetData {
        link: EmbarkLink!
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
        key: String
        value: String
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

    type EmbarkNumberAction implements EmbarkActionCore {
        component: String!
    }

    type EmbarkMultiActionData {
        components: [EmbarkMultiActionComponent!]!
    }

    type EmbarkMultiAction implements EmbarkActionCore {
        component: String!
        data: EmbarkMultiActionData!
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

    union EmbarkAction = EmbarkNumberActionSet | EmbarkTextActionSet | EmbarkTextAction | EmbarkSelectAction | EmbarkNumberAction | EmbarkMultiAction

    union EmbarkMultiActionComponent = EmbarkNumberAction | EmbarkDropdownAction | EmbarkSwitchAction

    type EmbarkGroupedResponseEach {
        key: String!
        content: EmbarkMessage!
    }

    type EmbarkGroupedResponse {
        component: String!
        title: String!
        items: [EmbarkMessage!]!
        each: [EmbarkGroupedResponseEach!]!
    }

    union EmbarkResponse = EmbarkGroupedResponse | EmbarkMessage

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
        api: [EmbarkApi!]!
        messages: [EmbarkMessage!]!
        externalRedirect: EmbarkExternalRedirect
        action: EmbarkAction
        response: [EmbarkResponse!]!
        tooltips: [EmbarkTooltip!]!
        track: EmbarkTrack
        redirects: [EmbarkRedirect!]!
    }

    type EmbarkTrack {
        eventName: String!
        eventKeys: String!
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
    }

    type EmbarkRedirectBinaryExpression {
        type: EmbarkExpressionTypeBinary!
        key: String!
        value: String!
        to: String!
    }

    type EmbarkRedirectMultipleExpressions {
        to: String!
        type: EmbarkExpressionTypeMultiple!,
        subExpressions: [EmbarkExpression!]!
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
        partnerConfigs: [EmbarkPartnerConfig!]!
        passages: [EmbarkPassage!]!
    }
`;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      embarkStory: async (_, { name }: { name: string }) => {
        const dir = await promises.readdir("angel-data");

        if (!dir.includes(`${name}.json`)) {
          throw new Error(`Can't find story with name: ${name}`);
        }

        const file = await promises.readFile(`angel-data/${name}.json`, {
          encoding: "utf-8"
        });

        const json = JSON.parse(file);
        const storyData = parseStoryData(json);

        return storyData;
      }
    }
  }
});