import * as React from "react";
import styled from "@emotion/styled";
import { ContinueButton } from "../../ContinueButton";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { Tooltip } from "../../Tooltip";
import { InlineTextAction } from "../InlineActions/InlineTextAction";
import { StoreContext } from "../../KeyValueStore";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CardsContainer = styled.form`
  display: flex;
  justify-content: center;
`;

const Card = styled.div`
  background-color: ${colorsV2.white};
  padding-bottom: 36px;

  :first-of-type {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  :not(:last-child) {
    margin-right: 1px;
  }

  :nth-last-of-type(1) {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const CardTitle = styled.span`
  font-family: ${fonts.CIRCULAR};
  font-size: 14px;
  font-weight: 500;
  padding-top: 16px;
  padding-left: 16px;
  display: block;
`;

const Spacer = styled.div`
  height: 20px;
`;

interface Props {
  passageName: string;
  action: any;
  changePassage: (name: string) => void;
}

/* 
<TextActionSet next="[[Label->Link]]">
  <TextAction
    title="Adress"
    placeholder="Gatunamn"
    large="true"
    key="streetAddress">
  </TextAction>
  <TextAction
    title="Postnummer"
    placeholder="172 40"
    mask="PostalCode"
    key="postalNumber">
  </TextAction>
</TextActionSet>
*/

interface State {
  values: { [key: string]: string };
  continueDisabled: boolean;
}

interface Action {
  type: "setValue";
  key: string;
  value: string;
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setValue":
      const newValues = { ...state.values, [action.key]: action.value };
      return {
        ...state,
        values: newValues,
        continueDisabled: Object.keys(newValues)
          .map(key => newValues[key] === null || newValues[key] === "")
          .includes(true)
      };
    default:
      return state;
  }
};

export const TextActionSet: React.FunctionComponent<Props> = props => {
  const { setValue } = React.useContext(StoreContext);
  const [state, dispatch] = React.useReducer(reducer, undefined, () => {
    const values = props.action.data.textActions.reduce((acc, curr) => {
      return { ...acc, [curr.data.key]: null };
    }, {});

    return {
      values,
      continueDisabled: true
    };
  });

  const onContinue = () => {
    Object.keys(state.values).forEach(key => setValue(key, state.values[key]));
    setValue(
      `${props.passageName}Result`,
      Object.keys(state.values).reduce(
        (acc, curr) => `${acc} ${state.values[curr]}`,
        ""
      )
    );
    props.changePassage(props.action.data.link.name);
  };

  return (
    <Container>
      <CardsContainer
        onSubmit={e => {
          e.preventDefault();
          onContinue();
        }}
      >
        {props.action.data.textActions.map(textAction => (
          <Card key={textAction.data.key}>
            <Tooltip tooltip={textAction.data.tooltip} />
            <CardTitle>{textAction.data.title}</CardTitle>
            <InlineTextAction
              large={textAction.data.large}
              placeholder={textAction.data.placeholder}
              onChange={value => {
                dispatch({ type: "setValue", key: textAction.data.key, value });
              }}
              value={state.values[textAction.data.key] || ""}
              mask={textAction.data.mask}
            />
          </Card>
        ))}
        <input type="submit" style={{ display: "none" }} />
      </CardsContainer>
      <Spacer />
      <ContinueButton
        disabled={state.continueDisabled}
        text={props.action.data.link.label}
        onClick={onContinue}
      />
    </Container>
  );
};
