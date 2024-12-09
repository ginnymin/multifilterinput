import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OperatorSelector } from ".";

const mockOnChange = vi.fn();

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

  it("renders string options", async () => {
    render(<OperatorSelector type="string" onChange={mockOnChange} />);

    await screen.findAllByRole("option");

    expect(screen.getAllByRole("option")).toHaveLength(6);
    expect(screen.queryByRole("option", { name: /</ })).toBeNull();
  });

  it("renders number options", async () => {
    render(<OperatorSelector type="number" onChange={mockOnChange} />);

    await screen.findAllByRole("option");

    expect(screen.getAllByRole("option")).toHaveLength(8);
    expect(screen.queryByRole("option", { name: /contain/ })).toBeNull();
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
