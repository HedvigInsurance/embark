export const CARD_COUNT_BASE_BP_LG = 400;
export const CARD_COUNT_BASE_BP_SM = 250;

export const getCardCountMediaQuery = (
  cardCount: number,
  baseBp: number = CARD_COUNT_BASE_BP_LG
) => `(max-width: ${cardCount * baseBp}px)`;

export const mediaCardCount = (
  cardCount: number,
  baseBp: number = CARD_COUNT_BASE_BP_LG
) => (
  literals: TemplateStringsArray,
  ...interpolations: ReadonlyArray<string>
) => `
  @media ${getCardCountMediaQuery(cardCount, baseBp)} {
    ${literals
      .map((literal, i) => literal + (interpolations[i] ?? ""))
      .join("") ?? ""}
  }
`;
