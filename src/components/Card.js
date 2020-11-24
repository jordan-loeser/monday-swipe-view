import React, { useContext } from "react";
import styled from "styled-components";
import Moment from "moment";
import { Button, Tooltip } from "monday-ui-react-core";
import Icon from "monday-ui-react-core/dist/Icon";
import Activity from "monday-ui-react-core/dist/icons/Activity";
import { MondayContext } from "../App";

const formatDate = (dateString) => {
  const date = new Moment(dateString);
  return date.calendar({
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    nextWeek: "dddd",
    lastDay: "[Yesterday]",
    lastWeek: "[Last] dddd",
    sameElse: "DD/MM/YYYY",
  });
};

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
  background-color: #0085ff;
  color: #fff;
  padding: 24px 16px 16px;
  overflow-y: scroll;
`;

const Title = styled.h1`
  margin: 0 8px;
  flex: 1;
`;

const MetaContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TooltipContainer = styled.div`
  opacity: 0.32;
  position: relative;
  bottom: -2px;
`;

const Card = ({ item }) => {
  const monday = useContext(MondayContext);
  console.log("***", Icon);
  return (
    <CardContainer>
      <TitleContainer>
        <Title>{item.name}</Title>
        <MetaContainer>
          <TooltipContainer>
            <Tooltip
              showDelay={300}
              position={"top"}
              moveBy={{ main: 24, secondary: 0 }}
              content={
                <>
                  <div>
                    <b>Created:</b> {formatDate(item.created_at)}
                  </div>
                  <div>
                    <b>Updated:</b> {formatDate(item.updated_at)}
                  </div>
                </>
              }
            >
              <Icon
                iconType={"SVG"}
                icon={Activity}
                iconLabel="my bolt svg icon"
                clickable
                iconSize={32}
              />
            </Tooltip>
          </TooltipContainer>
          <Button
            size={Button.sizes.SMALL}
            kind={Button.kinds.TERTIARY}
            color={Button.colors.ON_PRIMARY_COLOR}
            onClick={() => {
              // TODO: updatee to `kind: "columns"` after API is fixed
              monday.execute("openItemCard", {
                itemId: item.id,
                kind: "updates",
              });
            }}
          >
            View Item
          </Button>
        </MetaContainer>
      </TitleContainer>
    </CardContainer>
  );
};

export default Card;
