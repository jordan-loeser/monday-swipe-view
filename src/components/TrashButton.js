import React from "react";
import styled from "styled-components";
import { Button } from "monday-ui-react-core";

const Container = styled.div`
  position: relative;
  width: 91px;
  height: 40px;
`;

const Counter = styled.div`
  position: absolute;
  top: -5px;
  right: 0;
  background-color: #0085ff;
  padding: 2px 5px 1px 5px;
  border-radius: 12px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 400;
  transform: translateX(30%);
  z-index: 10000;
`;

const TrashButton = ({ trash, onClick }) => (
  <Container>
    <Counter>{trash.length}</Counter>
    <Button
      size={Button.sizes.MEDIUM}
      kind={Button.kinds.SECONDARY}
      rightIcon="fa fa-trash-alt"
      ariaLabel="Open Trash"
      onClick={onClick}
    >
      View
    </Button>
  </Container>
);

export default TrashButton;
