import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OperatorDefinition } from "@lib/types";

import { OperatorSelector } from ".";

const mockOnChange = vi.fn();

const operators: OperatorDefinition[] = [
  { id: "matches", value: "matches", types: ["string", "number", "select"] },
  { id: "earlier", value: "is earlier than", types: ["date"] },
  { id: "later", value: "is later than", types: ["date"] },
  { id: "contains", value: "contains", types: ["multiselect"] },
];

describe("Components: OperatorSelector", () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders", async () => {
    render(<OperatorSelector type="string" onChange={mockOnChange} />);

    await screen.findByRole("combobox", { name: "Filter operator" });

    expect(
      screen.getByRole("combobox", { name: "Filter operator" })
    ).toBeVisible();
    expect(screen.getByPlaceholderText("Select an operator...")).toBeVisible();
    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getAllByRole("option")).toHaveLength(6);
  });

  it("renders default string options", async () => {
    render(<OperatorSelector type="string" onChange={mockOnChange} />);

    await screen.findAllByRole("option");

    expect(screen.getAllByRole("option")).toHaveLength(6);
    expect(screen.queryByRole("option", { name: /</ })).toBeNull();
  });

  it("renders default number options", async () => {
    render(<OperatorSelector type="number" onChange={mockOnChange} />);

    await screen.findAllByRole("option");

    expect(screen.getAllByRole("option")).toHaveLength(8);
    expect(screen.queryByRole("option", { name: /contain/ })).toBeNull();
  });

  it("renders custom operators", async () => {
    render(
      <OperatorSelector
        operators={operators}
        type="date"
        onChange={mockOnChange}
      />
    );

    await screen.findAllByRole("option");

    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("calls onChange", async () => {
    render(<OperatorSelector type="string" onChange={mockOnChange} />);

    await userEvent.type(screen.getByRole("combobox"), "=");
    await userEvent.keyboard("{Enter}");

    expect(mockOnChange).toHaveBeenCalledWith({
      id: "=",
      value: "equals (=)",
      types: ["string", "number", "date", "select", "multiselect"],
    });
  });
});
