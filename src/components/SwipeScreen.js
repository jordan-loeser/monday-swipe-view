import React from "react";
import styled from "styled-components";
import TinderCard from "react-tinder-card";
import { Button, Loader } from "monday-ui-react-core";
import { Card, TrashButton } from "./index";

const SwipeScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #f5f6f8;
`;

// We want this to take up space even if there are no cards...
const CardContainer = styled.div`
  display: flex;
  width: 100vh;
  max-width: 260px;
  min-height: 384px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Swipable = styled(TinderCard)`
  position: absolute;
  border-radius: 16px;
  &:first-child,
  &:last-child {
    box-shadow: 0px 6px 20px -2px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonContainer = styled.div`
  padding: 24px;
  margin-top: 24px;
`;

const StyledButton = styled(Button)`
  margin: 0px 12px;
`;

const LoaderContainer = styled.div`
  width: 48px;
  align-self: center;
  margin: 0 auto;
`;

const Instructions = styled.p`
  align-self: center;
  text-align: center;
  margin-top: 0;
`;

const TrashButtonContainer = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
`;

const SwipeScreen = ({
  loading,
  items,
  trash,
  onSwipe,
  onTrashButtonPress,
  onKeepButtonPress,
  onEmptyTrash,
}) => {
  if (!items) return null;
  return (
    <SwipeScreenContainer data-testid="swipe-screen">
      {loading || items.length === 0 ? (
        <CardContainer>
          {loading ? (
            <LoaderContainer data-testid="swipe-loader">
              <Loader svgClassName="loader-size-md" />
            </LoaderContainer>
          ) : (
            <>
              <Instructions data-testid="items-empty-instructions">
                You've swiped on all the items!
              </Instructions>
              <Instructions>
                Empty the trash or select a new group to start fresh.
              </Instructions>
              <br />
              <TrashButton trash={trash} onClick={() => onEmptyTrash()} />
              <br />
              <br />
              <Button
                size={Button.sizes.SMALL}
                kind={Button.kinds.TERTIARY}
                onClick={() => {
                  window.open(
                    "https://support.monday.com/hc/en-us/articles/115005312729-The-Recycle-Bin",
                    "_blank"
                  );
                }}
              >
                View Removed Items
              </Button>
            </>
          )}
        </CardContainer>
      ) : (
        <>
          <CardContainer data-testid="swipe-cards">
            {items.map((item, i) => (
              <Swipable
                key={`swipe-${i}`}
                onSwipe={(dir) => onSwipe(dir, item)}
                preventSwipe={["up", "down"]}
                flickOnSwipe
              >
                <Card item={item} />
              </Swipable>
            ))}
          </CardContainer>
          <ButtonContainer>
            <StyledButton
              onClick={onTrashButtonPress}
              disabled={!(items.length > 0)}
              size={Button.sizes.LARGE}
              kind={Button.kinds.PRIMARY}
              color={Button.colors.NEGATIVE}
              leftIcon="fa fa-chevron-left"
            >
              Trash It
            </StyledButton>
            <StyledButton
              onClick={onKeepButtonPress}
              disabled={!(items.length > 0)}
              size={Button.sizes.LARGE}
              kind={Button.kinds.PRIMARY}
              color={Button.colors.POSITIVE}
              rightIcon="fa fa-chevron-right"
            >
              Keep It
            </StyledButton>
          </ButtonContainer>
          {trash.length > 0 && (
            <TrashButtonContainer>
              <TrashButton trash={trash} onClick={() => onEmptyTrash()} />
            </TrashButtonContainer>
          )}
        </>
      )}
    </SwipeScreenContainer>
  );
};

export default SwipeScreen;
