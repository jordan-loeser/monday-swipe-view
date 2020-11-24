import React from "react";
import styled from "styled-components";
// import Moment from "moment";
import { Button } from "monday-ui-react-core";

// const formatDate = (dateString) => {
//   const date = new Moment(dateString);
//   return date.calendar({
//     sameDay: "[Today]",
//     nextDay: "[Tomorrow]",
//     nextWeek: "dddd",
//     lastDay: "[Yesterday]",
//     lastWeek: "[Last] dddd",
//     sameElse: "DD/MM/YYYY",
//   });
// };

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  position: relative;
  background-color: #fff;
  width: 80vw;
  max-width: 260px;
  height: 384px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #784bd1;
  color: #fff;
  padding: 24px 16px 16px;
  overflow-y: scroll;
`;

const Title = styled.h1`
  margin: 0 8px;
  flex: 1;
`;

// const MetaContainer = styled.div`
//   display: flex;
//   flex-direction: row;
//   padding: 16px 24px;
//   font-size: 14px;
//   line-height: 1.4;
// `;

// const Meta = styled.div`
//   flex: 1;
// `;

// const MetaTitle = styled.p`
//   margin: 0;
//   font-weight: bold;
//   color: #6e6f8f;
// `;

// const MetaData = styled.p`
//   margin: 0;
// `;

const StyledButton = styled(Button)`
  align-self: flex-end;
  //   margin-bottom: 8px;
`;

const Card = ({ item }) => {
  console.log("*******", item);
  return (
    <CardContainer>
      <TitleContainer>
        <Title>{item.name}</Title>
        <StyledButton
          size={Button.sizes.SMALL}
          kind={Button.kinds.SECONDARY}
          color={Button.colors.ON_PRIMARY_COLOR}
        >
          View Item
        </StyledButton>
      </TitleContainer>
      {/* <MetaContainer>
            <Meta>
            <MetaTitle>Created</MetaTitle>
            <MetaData>{formatDate(item.created_at)}</MetaData>
            </Meta>
            <Meta>
            <MetaTitle>Updated</MetaTitle>
            <MetaData>{formatDate(item.updated_at)}</MetaData>
            </Meta>
            </MetaContainer> */}
    </CardContainer>
  );
};

export default Card;
