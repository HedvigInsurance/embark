import { storyKeywords } from "./src/storyKeywords";
import { makeExecutableSchema } from "graphql-tools";
import { promises } from "fs";
import { parseStoryData } from "./src/parseStoryData";

const typeDefs = `
    type Query {
        angelStory(name: String!): AngelStory
    }

    type AngelKeywords {
        ${Object.keys(storyKeywords).map(key => `${key}: String`)}
    }

    enum AngelPartnerConfigAlignment {
        center
        left
    }

    type AngelPartnerConfig {
        alignment: AngelPartnerConfigAlignment!
        image: String!
        isDefault: Boolean!
        name: String!
    }

    type AngelLink {
        name: String!
        label: String!
    }

    interface AngelApiCore {
        component: String!
    }

    type AngelApiPersonalInformationData {
        match: AngelLink!
        noMatch: AngelLink!
        error: AngelLink!
    }

    type AngelApiPersonalInformation implements AngelApiCore {
        component: String!
        data: AngelApiPersonalInformationData!
    }

    type AngelApiHouseInformationData {
        match: AngelLink!
        noMatch: AngelLink!
        error: AngelLink!
    }

    type AngelApiHouseInformation implements AngelApiCore {
        component: String!
        data: AngelApiHouseInformation!
    }

    type AngelApiCreateQuoteData {
        uwlimits: AngelLink!
        success: AngelLink!
        error: AngelLink!
    }

    type AngelApiCreateQuote implements AngelApiCore {
        component: String!
        data: AngelApiCreateQuoteData!
    }

    union AngelApi = AngelApiPersonalInformation | AngelApiHouseInformation | AngelApiCreateQuote

    enum AngelExternalRedirect {
        email
    }

    interface AngelActionCore {
        component: String!
    }

    type AngelNumberActionSetData {
        link: AngelLink!
    }

    type AngelNumberActionSet implements AngelActionCore {
        component: String!
        data: AngelNumberActionSetData
    }

    type AngelTextActionSetData {
        link: AngelLink!
    }

    type AngelTextActionSet implements AngelActionCore {
        component: String!
        data: AngelTextActionSetData
    }

    type AngelTextAction implements AngelActionCore {
        component: String!
    }

    type AngelSelectAction implements AngelActionCore {
        component: String!
    }

    type AngelNumberAction implements AngelActionCore {
        component: String!
    }

    type AngelMultiActionData {
        components: [AngelMultiActionComponent!]!
    }

    type AngelMultiAction implements AngelActionCore {
        component: String!
        data: AngelMultiActionData!
    }

    type AngelDropdownOption {
        value: String!
        text: String!
    }

    type AngelDropdownActionData {
        label: String!
        key: String!
        options: [AngelDropdownOption!]!
    }

    type AngelDropdownAction implements AngelActionCore {
        component: String!
        data: AngelDropdownActionData!
    }

    type AngelSwitchActionData {
        label: String!
        key: String!
        defaultValue: Boolean!
    }

    type AngelSwitchAction implements AngelActionCore {
        component: String!
        data: AngelSwitchActionData!
    }

    union AngelAction = AngelNumberActionSet | AngelTextActionSet | AngelTextAction | AngelSelectAction | AngelNumberAction | AngelMultiAction

    union AngelMultiActionComponent = AngelNumberAction | AngelDropdownAction | AngelSwitchAction

    type AngelGroupedResponseEach {
        key: String!
        content: AngelMessage!
    }

    type AngelGroupedResponse {
        component: String!
        title: String!
        items: [AngelMessage!]!
        each: [AngelGroupedResponseEach!]!
    }

    union AngelResponse = AngelGroupedResponse | AngelMessage

    type AngelTooltip {
        title: String!
        description: String!
    }

    type AngelPassage {
        id: String!
        text: String!
        name: String!
        url: String
        allLinks: [AngelLink!]!
        api: [AngelApi!]!
        messages: [AngelMessage!]!
        externalRedirect: AngelExternalRedirect
        action: AngelAction
        response: [AngelResponse!]!
        tooltips: [AngelTooltip!]!
        track: AngelTrack
        redirects: [AngelRedirect!]!
    }

    type AngelTrack {
        eventName: String!
        eventKeys: String!
    }

    enum AngelExpressionType {
        AND
        OR
        EQUALS
        NOT_EQUALS
        MORE_THAN
        LESS_THAN
        MORE_THAN_OR_EQUALS
        LESS_THAN_OR_EQUALS
        ALWAYS
        NEVER
    }

    interface AngelExpressionCore {
        type: AngelExpressionType!
    }

    union AngelExpression = AngelExpressionUnary | AngelExpressionBinary | AngelExpressionMultiple

    type AngelExpressionUnary implements AngelExpressionCore {
        type: AngelExpressionType!
    }

    type AngelExpressionBinary implements AngelExpressionCore {
        type: AngelExpressionType!
        key: String!
        value: String!
        text: String
    }

    type AngelExpressionMultiple {
        type: AngelExpressionType!
        subExpressions: [AngelExpression!]!
    }

    union AngelRedirect = AngelRedirectUnaryExpression | AngelRedirectBinaryExpression | AngelRedirectMultipleExpressions

    type AngelRedirectUnaryExpression implements AngelExpressionCore {
        type: AngelExpressionType!
        to: String!
    }

    type AngelRedirectBinaryExpression implements AngelExpressionCore {
        type: AngelExpressionType!
        key: String!
        value: String!
        to: String!
    }

    type AngelRedirectMultipleExpressions {
        to: String!
        type: AngelExpressionType!,
        subExpressions: [AngelExpression!]!
    }

    type AngelMessage {
        expressions: [AngelExpression!]!
        text: String!
    }

    type AngelStory {
        id: String!
        startPassage: String!
        name: String!
        keywords: AngelKeywords!
        partnerConfigs: [AngelPartnerConfig!]!
        passages: [AngelPassage!]!
    }
`;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      angelStory: async (_, { name }: { name: string }) => {
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
