import * as React from "react";
import styled from "@emotion/styled";
import { colorsV2, fonts } from "@hedviginsurance/brand";
import { ContinueButton } from "../../ContinueButton";
import { InlineNumberAction } from "../InlineActions/InlineNumberAction";
import { Tooltip } from "../../Tooltip";
import { StoreContext } from "../../KeyValueStore";

type NumberActionSetProps = {
  passageName: string;
  action: any;
  changePassage: (name: string) => void;
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

interface CardProps {
  borderRadius: string;
}

const Card = styled.form<CardProps>`
  position: relative;
  border-radius: 8px;
  background-color: ${colorsV2.white};
  display: inline-block;
  width: 100%;
  max-width: 200px;
  margin-right: 1px;
  ${props => `border-radius: ${props.borderRadius}`};
`;

const CardTitle = styled.span`
  font-family: ${fonts.CIRCULAR};
  font-size: 14px;
  font-weight: 500;
  padding-top: 15px;
  padding-left: 20px;
  display: inline-block;
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
  const [state, dispatch] = React.useReducer(reducer, undefined, () => {
    return props.action.data.numberActions.reduce((acc: any, curr: any) => {
      return { ...acc, [curr.data.key]: null };
    }, {});
  });
  const [continueDisabled, setContinueDisabled] = React.useState(true);
  const { setValue } = React.useContext(StoreContext);

  React.useEffect(() => {
    setContinueDisabled(
      Object.keys(state)
        .map(key => state[key] == null || state[key] == "" || state[key] == 0)
        .indexOf(true) != -1
    );
  }, [state]);

  return (
    <Container>
      <CardsContainer>
        {props.action.data.numberActions.map(
          (numberAction: any, index: number) => (
            <Card
              key={numberAction.data.key}
              borderRadius={(() => {
                if (index == props.action.data.numberActions.length - 1) {
                  return "0 8px 8px 0";
                }

                return index == 0 ? "8px 0 0 8px" : "0";
              })()}
            >
              <Tooltip tooltip={numberAction.data.tooltip} />
              <CardTitle>{numberAction.data.title}</CardTitle>
              <InlineNumberAction
                placeholder={numberAction.data.placeholder}
                unit={numberAction.data.unit}
                value={state[numberAction.data.key] || ""}
                onValue={value => {
                  dispatch({
                    type: "setValue",
                    key: numberAction.data.key,
                    value
                  });
                }}
              />
            </Card>
          )
        )}
      </CardsContainer>
      <Spacer />
      <ContinueButton
        disabled={continueDisabled}
        text={props.action.data.link.label}
        onClick={() => {
          Object.keys(state).forEach(key => {
            setValue(key, state[key]);
          });
          setValue(
            `${props.passageName}Result`,
            Object.keys(state).reduce(
              (acc, curr) => `${acc} ${state[curr]}`,
              ""
            )
          );
          props.changePassage(props.action.data.link.name);
        }}
      />
    </Container>
  );
};
