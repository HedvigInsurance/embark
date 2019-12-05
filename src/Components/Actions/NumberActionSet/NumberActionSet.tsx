import * as React from "react";
import styled from "@emotion/styled";
import { ContinueButton } from "../../ContinueButton";
import { StoreContext } from "../../KeyValueStore";
import { NumberEditCard } from "./NumberEditCard";
import { CARD_COUNT_BASE_BP_SM, mediaCardCount } from "../../Utils/cardCount";
import { useAutoFocus } from "../../../Utils/useAutoFocus";

type NumberActionSetProps = {
  isTransitioning: boolean;
  passageName: string;
  action: any;
  changePassage: (name: string) => void;
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const CardsContainer = styled.div<{ cardCount: number }>`
  display: flex;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;

  ${props => mediaCardCount(props.cardCount, CARD_COUNT_BASE_BP_SM)`
    display: flex;
    flex-direction: column;
    width: 100%;
  `}
`;

const Spacer = styled.div`
  height: 20px;
`;

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setValue":
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
};

export const NumberActionSet = (props: NumberActionSetProps) => {
  const { setValue, store } = React.useContext(StoreContext);
  const [state, dispatch] = React.useReducer(reducer, undefined, () => {
    return props.action.data.numberActions.reduce((acc: any, curr: any) => {
      return { ...acc, [curr.data.key]: store[curr.data.key] || null };
    }, {});
  });
  const [continueDisabled, setContinueDisabled] = React.useState(true);

  const onContinue = () => {
    Object.keys(state).forEach(key => {
      setValue(key, state[key]);
    });
    setValue(
      `${props.passageName}Result`,
      Object.keys(state).reduce((acc, curr) => `${acc} ${state[curr]}`, "")
    );
    props.changePassage(props.action.data.link.name);
  };

  React.useEffect(() => {
    setContinueDisabled(
      Object.keys(state)
        .map(key => state[key] == null || state[key] == "" || state[key] == 0)
        .indexOf(true) != -1
    );
  }, [state]);

  const inputRef = useAutoFocus(!props.isTransitioning);

  return (
    <Container>
      <CardsContainer cardCount={props.action.data.numberActions.length}>
        {props.action.data.numberActions.map((action: any) => (
          <NumberEditCard
            inputRef={inputRef}
            key={action.data.key}
            action={action}
            onSubmit={() => {
              if (!continueDisabled) {
                onContinue();
              }
            }}
            value={state[action.data.key] || ""}
            onChange={value =>
              dispatch({
                type: "setValue",
                key: action.data.key,
                value
              })
            }
            cardCount={props.action.data.numberActions.length}
          />
        ))}
      </CardsContainer>
      <Spacer />
      <ContinueButton
        disabled={continueDisabled}
        text={props.action.data.link.label}
        onClick={onContinue}
      />
    </Container>
  );
};
