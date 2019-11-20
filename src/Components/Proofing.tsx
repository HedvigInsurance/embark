import * as React from "react";
import styled from "@emotion/styled";
import { fonts, colors } from "@hedviginsurance/brand";

import { Message } from "./Message";

type ProofingProps = {
  name: String;
  passages: [any];
};

const Container = styled.div`
  padding: 50px;
  background-color: ${colors.PINK};
`;

const Title = styled.h1`
  font-family: ${fonts.SORAY};
`;

const PassageTitle = styled.h3`
  font-family: ${fonts.CIRCULAR};
`;

const PassageBody = styled.p`
  font-family: ${fonts.CIRCULAR};
  padding-top: 20px;
`;

const PassageContainer = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
`;

const Option = styled.p`
  display: inline-block;
  font-family: ${fonts.CIRCULAR};
  padding: 20px;
  margin-right: 10px;
  background-color: ${colors.WHITE};
`;

const OptionContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

type ActionProps = {
  action: any;
};

const Action = (props: ActionProps) => {
  if (!props.action) {
    return null;
  }

  if (props.action.component == "SelectAction") {
    return (
      <OptionContainer>
        {props.action.data.options.map((option: any) => (
          <Option key={option.link.name}>
            {option.link.label} -> {option.link.name}
            {option.tooltip && (
              <>
                <p>
                  <br /> Tooltip title: <b>{option.tooltip.title}</b>
                </p>
                <p>
                  <br /> Tooltip description:{" "}
                  <b>{option.tooltip.description}</b>
                </p>
              </>
            )}
          </Option>
        ))}
      </OptionContainer>
    );
  }

  return null;
};

export const Proofing = (props: ProofingProps) => {
  return (
    <Container>
      <Title>{props.name}</Title>
      {props.passages.map(passage => (
        <PassageContainer key={passage.name}>
          <PassageTitle>{passage.name}</PassageTitle>
          <PassageBody>
            {passage.messages.length == 0 && <p>No messages</p>}
            {passage.messages.map((message: any) => (
              <Message
                key={message.text}
                isResponse={false}
                message={message}
              />
            ))}
          </PassageBody>
          <Action action={passage.action} />
        </PassageContainer>
      ))}
    </Container>
  );
};
