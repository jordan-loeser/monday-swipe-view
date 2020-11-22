import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  cursor: pointer;
  user-select: none;
  position: relative;
  background-color: #fff;
  width: 80vw;
  max-width: 260px;
  height: 300px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  border: 1px solid #e9e9e9;
`;

const Card = ({ item }) => <CardContainer>{item.name}</CardContainer>;

export default Card;
