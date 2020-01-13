import * as React from "react";
import { fonts, colorsV2 } from "@hedviginsurance/brand";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { DataFetchContext, DataFetchOperation } from "./DataFetchContext";
import { ExternalInsuranceProviderStatus } from "../../API/externalInsuranceProviderData";
import { Loading } from "../../API/Loading";

const Container = styled.div`
  position: fixed;
  right: 20px;
  top: 10px;
`;

const Notification = styled(motion.div)`
  display: flex;
  align-items: center;
  flex-direction: row;
  background-color: ${colorsV2.white};
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 8px 13px 0 rgba(0, 0, 0, 0.18);
`;

const Body = styled.div`
  margin-left: 5px;
  margin-right: 30px;
`;

const Title = styled.h5`
  font-family: ${fonts.CIRCULAR};
  font-weight: 800;
`;

const Subtitle = styled.p`
  font-family: ${fonts.CIRCULAR};
  font-weight: 300;
  margin-top: 2px;
  font-size: 11px;
`;

export const BackgroundFetchNotification = () => {
  const { operation } = React.useContext(DataFetchContext);

  const [
    currentOperation,
    setCurrentOperation
  ] = React.useState<DataFetchOperation | null>(null);
  const [hidden, setHidden] = React.useState(true);

  React.useEffect(() => {
    if (
      operation?.data?.status !== ExternalInsuranceProviderStatus.FETCHING &&
      operation?.data?.status !== ExternalInsuranceProviderStatus.COMPLETED
    ) {
      setHidden(true);
      setCurrentOperation(operation);
      return;
    }

    if (currentOperation === null) {
      setHidden(false);
      setCurrentOperation(operation);
    } else {
      setHidden(true);
      setTimeout(() => {
        setHidden(false);
        setCurrentOperation(operation);
      }, 1000);
    }
  }, [operation?.data?.status]);

  return (
    <Container>
      <Notification
        initial={{
          x: "100%",
          opacity: 0
        }}
        animate={hidden ? { opacity: 0, x: "100%" } : { opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 100,
          delay: 0.5
        }}
      >
        {currentOperation && (
          <>
            {currentOperation.provider.icon &&
              currentOperation.provider.icon({ forceWidth: false })}
            <Body>
              <Title>{currentOperation.provider.name}</Title>
              <Subtitle>
                {currentOperation.data?.status ===
                ExternalInsuranceProviderStatus.FETCHING
                  ? "Vi hämtar din försäkring..."
                  : `Vi hittade din försäkring hos ${currentOperation.provider.name}.`}
              </Subtitle>
            </Body>
            {currentOperation.data?.status ===
              ExternalInsuranceProviderStatus.FETCHING && (
              <Loading addBorder size="small" />
            )}
          </>
        )}
      </Notification>
    </Container>
  );
};
