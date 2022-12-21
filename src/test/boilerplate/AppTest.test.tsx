/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, expect, it } from "vitest";
import { AppTest } from "./AppTest";
import { render, screen, userEvent } from "../../utils/test-utils";

describe("Simple working test", () => {
  it.skip("the title is visible", () => {
    render(<AppTest />);
    expect(screen.getByText(/Hello Vite \+ React!/i)).toBeInTheDocument();
  });

  it.skip("should increment count on click", async () => {
    render(<AppTest />);
    expect(screen.getByText(/count is: 0/i)).toBeInTheDocument();
    await userEvent.click(screen.getByTitle("Increment count"));
    expect(screen.getByText(/count is: 1/i)).toBeInTheDocument();
  });
});
