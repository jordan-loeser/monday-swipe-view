import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("Renders instructions if no backlog group is chosen", () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId("instructions")).toBeInTheDocument();
});
