import React from "react";
import styled from "styled-components";

const InstructionScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #f5f6f8;
`;

const InstructionsScreen = () => (
  <InstructionScreenContainer data-testid="instructions">
    {/* <h1>Matchbox</h1>
    <h2>Clean up your backlog</h2> */}
    <p>Please select a backlog group in the settings panel to use this view.</p>
  </InstructionScreenContainer>
);

export default InstructionsScreen;
