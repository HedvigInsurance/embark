import * as React from "react"
import styled from "@emotion/styled"
import { fonts, colors } from "@hedviginsurance/brand"

import { Message } from "./Message"

type ProofingProps = {
    name: String,
    passages: [any]
}

const Container = styled.div`
    padding: 50px;
    background-color: ${colors.PINK}
`

const Title = styled.h1`
    font-family: ${fonts.SORAY};
`

const PassageTitle = styled.h3`
    font-family: ${fonts.CIRCULAR};
`

const PassageBody = styled.p`
    font-family: ${fonts.CIRCULAR};
    padding-top: 20px;
`

const PassageContainer = styled.div`
    padding-top: 20px;
    padding-bottom: 20px;
`

export const Proofing = (props: ProofingProps) => {
    return <Container>
            <Title>{props.name}</Title>
            {props.passages.map(passage => 
                <PassageContainer>
                    <PassageTitle>{passage.name}</PassageTitle>
                    <PassageBody>
                        {passage.messages.length == 0 && <p>No messages</p>}
                        {passage.messages.map(message => 
                            <Message message={message} />
                        )}
                    </PassageBody>
                </PassageContainer>
            )}
        </Container>
}