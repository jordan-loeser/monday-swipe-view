import React from "react";
import styled from "styled-components";
import TinderCard from "react-tinder-card";
import { Button } from "monday-ui-react-core";

// We want this to take up space even if there are no cards...
const CardContainer = styled.div`
  width: 100vh;
  max-width: 260px;
  min-height: 300px;
`;

const Swipable = styled(TinderCard)`
  position: absolute;
`;

const Card = styled.div`
  cursor: pointer;
  user-select: none;
  position: relative;
  background-color: #fff;
  width: 80vw;
  max-width: 260px;
  height: 300px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  border: 1px solid #e9e9e9;
`;

const ButtonContainer = styled.div`
  padding: 24px;
`;

const SwipeScreen = ({
  loading,
  items,
  onSwipe,
  onTrashButtonPress,
  onKeepButtonPress,
}) => (
  <>
    {items.length > 0 ? (
      <CardContainer>
        {loading ? (
          <p>Loading...</p>
        ) : (
          items.map((item, i) => (
            <Swipable
              key={`swipe-${i}`}
              onSwipe={(dir) => onSwipe(dir, item)}
              preventSwipe={["up", "down"]}
            >
              <Card>{item.name}</Card>
            </Swipable>
          ))
        )}
      </CardContainer>
    ) : (
      <p>You've swiped on all the items! Press finish or select a new board.</p>
    )}
    <ButtonContainer>
      <Button
        size={Button.sizes.MEDIUM}
        rightIcon="fa fa-chevron-right"
        onClick={onTrashButtonPress}
        disabled={!(items.length > 0)}
      >
        Trash It
      </Button>
      <Button
        size={Button.sizes.MEDIUM}
        rightIcon="fa fa-chevron-right"
        onClick={onKeepButtonPress}
        disabled={!(items.length > 0)}
      >
        Keep It
      </Button>
    </ButtonContainer>
  </>
);

export default SwipeScreen;
