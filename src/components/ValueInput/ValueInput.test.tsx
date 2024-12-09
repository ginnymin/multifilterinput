import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ValueInput } from ".";

const mockOnSelect = vi.fn();
const mockOnBackspace = vi.fn();

describe("Components: ValueInput", () => {
  beforeEach(() => {
    mockOnSelect.mockClear();
    mockOnBackspace.mockClear();
  });

  it("renders input", () => {
    render(<ValueInput type="string" onSelect={mockOnSelect} />);

    expect(screen.getByRole("textbox", { name: "Filter value" })).toBeVisible();
    expect(screen.getByPlaceholderText("Enter value...")).toBeVisible();
    expect(screen.getByRole("button", { name: "Save filter" })).toBeDisabled();
  });

  it("renders combobox", async () => {
    render(
      <ValueInput
        type="select"
        onSelect={mockOnSelect}
        values={["Value 1", "Value 2", "Value 3"]}
      />
    );

    await screen.findByRole("combobox", { name: "Filter value" });

    expect(
      screen.getByRole("combobox", { name: "Filter value" })
    ).toBeVisible();
    expect(screen.getByPlaceholderText("Enter value...")).toBeVisible();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("renders with initial value", () => {
    render(
      <ValueInput
        type="string"
        onSelect={mockOnSelect}
        initialValue="Initial value"
      />
    );

    expect(screen.getByRole("textbox", { name: "Filter value" })).toHaveValue(
      "Initial value"
    );
    expect(screen.getByRole("button", { name: "Save filter" })).toBeEnabled();
  });

  it("calls onSelect", async () => {
    render(<ValueInput type="string" onSelect={mockOnSelect} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: "Filter value" }),
      "Value 1"
    );
    await userEvent.click(screen.getByRole("button", { name: "Save filter" }));

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith("Value 1");
  });

  it("calls onSelect after pressing enter", async () => {
    render(<ValueInput type="string" onSelect={mockOnSelect} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: "Filter value" }),
      "Value 1"
    );
    await userEvent.keyboard("{Enter}");

    expect(mockOnSelect).toHaveBeenCalledWith("Value 1");
  });

  it("calls onSelect after pressing enter with combobox", async () => {
    render(
      <ValueInput
        type="select"
        onSelect={mockOnSelect}
        values={["Value 1", "Value 2", "Value 3"]}
      />
    );

    await userEvent.type(
      screen.getByRole("combobox", { name: "Filter value" }),
      "Value 1"
    );
    await userEvent.keyboard("{Enter}");

    expect(mockOnSelect).not.toHaveBeenCalled();

    await userEvent.keyboard("{Enter}");

    expect(mockOnSelect).toHaveBeenCalledWith("Value 1");
  });

  it("calls onBackspace", async () => {
    render(
      <ValueInput
        type="string"
        onSelect={mockOnSelect}
        onBackspace={mockOnBackspace}
      />
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Filter value" }),
      "T"
    );
    await userEvent.keyboard("{Backspace}");

    expect(mockOnBackspace).not.toHaveBeenCalled();

    await userEvent.keyboard("{Backspace}");

    expect(mockOnBackspace).toHaveBeenCalledTimes(1);
  });

  it("adds and removes options with multiselect", async () => {
    render(
      <ValueInput
        type="multiselect"
        onSelect={mockOnSelect}
        values={["Value 1", "Value 2", "Value 3"]}
      />
    );

    await userEvent.type(
      screen.getByRole("combobox", { name: "Filter value" }),
      "Value 2"
    );
    await userEvent.keyboard("{Enter}");
    await userEvent.type(
      screen.getByRole("combobox", { name: "Filter value" }),
      "Value 3"
    );
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Escape}");

    expect(screen.getByText("Value 2")).toBeVisible();
    expect(screen.getByText("Value 3")).toBeVisible();

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.keyboard("{Backspace}");

    expect(screen.getByText("Value 2")).toBeVisible();
    expect(screen.queryByText("Value 3")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(screen.queryByText("Value 2")).toBeNull();
  });
});
