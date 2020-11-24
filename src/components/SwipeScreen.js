import React from "react";
import styled from "styled-components";
import TinderCard from "react-tinder-card";
import { Button, Loader } from "monday-ui-react-core";
import Card from "./Card";

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
  margin: 0px 48px;
`;

const LoaderContainer = styled.div`
  width: 48px;
  align-self: center;
  margin: 0 auto;
`;

const SwipeScreen = ({
  loading,
  items,
  onSwipe,
  onTrashButtonPress,
  onKeepButtonPress,
}) => {
  if (!items) return null;
  return (
    <SwipeScreenContainer data-testid="swipe-screen">
      <CardContainer>
        {loading ? (
          <LoaderContainer data-testid="swipe-loader">
            <Loader svgClassName="loader-size-md" />
          </LoaderContainer>
        ) : items.length > 0 ? (
          <div data-testid="swipe-cards">
            {items.map((item, i) => (
              <Swipable
                key={`swipe-${i}`}
                onSwipe={(dir) => onSwipe(dir, item)}
                preventSwipe={["up", "down"]}
              >
                <Card item={item} />
              </Swipable>
            ))}
          </div>
        ) : (
          <p data-testid="items-empty-instructions">
            You've swiped on all the items! Press finish or select a new board.
          </p>
        )}
      </CardContainer>
      {!loading && (
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
      )}
    </SwipeScreenContainer>
  );
};

export default SwipeScreen;
