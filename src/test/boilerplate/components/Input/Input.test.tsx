import { describe, expect, it } from "vitest";
import { Input } from "./Input";
import { render, screen, userEvent } from "../../../../utils/test-utils";

describe("Input", () => {
  it.skip("should render the input", () => {
    render(
      <Input
        name="email"
        type="email"
        error={undefined}
        placeholder="Email"
        label="Email Address"
        aria-label="Email Address"
      />
    );
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", {
        name: /email address/i,
      })
    ).toBeInTheDocument();
  });
  it.skip("should change input value", async () => {
    render(
      <Input
        name="email"
        type="email"
        error={undefined}
        placeholder="Email"
        label="Email Address"
        aria-label="Email Address"
      />
    );

    screen.logTestingPlaygroundURL();

    const input = screen.getByRole("textbox", {
      name: /email address/i,
    });
    expect(input).toBeInTheDocument();
    await userEvent.type(input, "1337");
    expect(input).toHaveValue("1337");
  });
  it.skip("should render the input with error", () => {
    render(
      <Input
        name="email"
        type="email"
        placeholder="Email"
        label="Email Address"
        aria-label="Email Address"
        error="Please enter your email"
      />
    );
    expect(
      screen.getByRole("textbox", {
        name: /email address/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter your email"
    );
  });
});
