import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Key } from "@lib/types";

import { Filter } from ".";

const keys: Key[] = [
  { id: "1", name: "String type", type: "string" },
  { id: "2", name: "Number type", type: "number" },
  { id: "3", name: "Date type", type: "date" },
  {
    id: "4",
    name: "Select type",
    type: "select",
    values: ["Value 1", "Value 2", "Value 3"],
  },
  {
    id: "5",
    name: "Multiselect type",
    type: "multiselect",
    values: ["Multi 1", "Multi 2", "Multi 3"],
  },
];

const mockOnSelect = vi.fn();

describe("Components: Filter", () => {
  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it("renders", () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    expect(screen.getByRole("combobox")).toBeVisible();
    expect(screen.getByPlaceholderText("Add a filter...")).toBeVisible();
  });

  it("renders key options when user clicks on input", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getAllByRole("option")).toHaveLength(keys.length);
  });

  it("renders filtered key options when user types", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.type(screen.getByRole("combobox"), "Number");

    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: "Number type" })).toBeVisible();
  });

  it("renders operator input and selected key when user selects a key", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "String type" }));

    expect(screen.getByText("String type")).toBeVisible();
    expect(screen.getByRole("combobox")).toBeVisible();
    expect(screen.getByPlaceholderText("Select an operator...")).toBeVisible();
  });

  it("renders text input and selected operator when user selects an operator", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "String type" }));
    await userEvent.click(screen.getByRole("option", { name: "equals (=)" }));

    expect(screen.getByText("String type")).toBeVisible();
    expect(screen.getByText("equals")).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Filter value" })).toBeVisible();
    expect(screen.getByPlaceholderText("Enter value...")).toBeVisible();
    expect(screen.getByRole("button", { name: "Save filter" })).toBeDisabled();
  });

  it("renders with default filter values", () => {
    render(
      <Filter
        keys={keys}
        onSelect={mockOnSelect}
        defaultFilter={{ key: "1", operator: "=", value: "Test" }}
      />
    );

    expect(screen.getByText("String type")).toBeVisible();
    expect(screen.getByText("equals")).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Filter value" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Filter value" })).toHaveValue(
      "Test"
    );
    expect(screen.getByRole("button", { name: "Save filter" })).toBeEnabled();
  });

  it("renders with default select values", async () => {
    render(
      <Filter
        keys={keys}
        onSelect={mockOnSelect}
        defaultFilter={{ key: "4", operator: "=", value: "Value 2" }}
      />
    );

    await screen.findByRole("combobox", { name: "Filter value" });

    expect(screen.getByText("Select type")).toBeVisible();
    expect(screen.getByText("equals")).toBeVisible();
    expect(
      screen.getByRole("combobox", { name: "Filter value" })
    ).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Filter value" })).toHaveValue(
      "Value 2"
    );

    await userEvent.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "Save filter" })).toBeEnabled();
  });

  it("renders with operator editable when default filter has set or !set", async () => {
    render(
      <Filter
        keys={keys}
        onSelect={mockOnSelect}
        defaultFilter={{ key: "1", operator: "set" }}
      />
    );

    await screen.findByRole("combobox", { name: "Filter operator" });

    expect(screen.getByText("String type")).toBeVisible();
    expect(screen.queryByText("set")).toBeNull();
    expect(
      screen.getByRole("combobox", { name: "Filter operator" })
    ).toBeVisible();
    expect(
      screen.getByRole("combobox", { name: "Filter operator" })
    ).toHaveValue("is set");
  });

  it("calls onSelect when user clicks save", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "String type" }));
    await userEvent.click(screen.getByRole("option", { name: "equals (=)" }));
    await userEvent.type(
      screen.getByRole("textbox", { name: "Filter value" }),
      "Test"
    );
    await userEvent.click(screen.getByRole("button", { name: "Save filter" }));

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith({
      key: "1",
      operator: "=",
      value: "Test",
    });
  });

  it("calls onSelect when doing a set comparison", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "String type" }));
    await userEvent.click(screen.getByRole("option", { name: "is set (set)" }));

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith({
      key: "1",
      operator: "set",
    });
  });

  it("calls onSelect when doing a !set comparison", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "String type" }));
    await userEvent.click(
      screen.getByRole("option", { name: "is not set (!set)" })
    );

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith({
      key: "1",
      operator: "!set",
    });
  });

  it("renders number input", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Number type" }));
    await userEvent.click(screen.getByRole("option", { name: "equals (=)" }));

    expect(
      screen.getByRole("spinbutton", { name: "Filter value" })
    ).toBeVisible();
    expect(screen.getByPlaceholderText("Enter value...")).toBeVisible();
  });

  it("renders select value input", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Select type" }));
    await userEvent.click(screen.getByRole("option", { name: "equals (=)" }));

    expect(screen.getByRole("combobox")).toBeVisible();
    expect(screen.getByPlaceholderText("Enter value...")).toBeVisible();
  });

  it("renders multiselect and sends selected values", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(
      screen.getByRole("option", { name: "Multiselect type" })
    );
    await userEvent.click(screen.getByRole("option", { name: "equals (=)" }));
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Multi 3" }));
    await userEvent.click(screen.getByRole("option", { name: "Multi 1" }));
    await userEvent.keyboard("{Escape}");
    await userEvent.click(screen.getByRole("button", { name: "Save filter" }));

    expect(mockOnSelect).toHaveBeenCalledWith({
      key: "5",
      operator: "=",
      value: ["Multi 3", "Multi 1"],
    });
  });

  it("handles backspace from operator", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "String type" }));

    expect(screen.queryByRole("combobox", { name: "Filter key" })).toBeNull();
    expect(
      screen.getByRole("combobox", { name: "Filter operator" })
    ).toBeVisible();

    await userEvent.keyboard("{Backspace}");

    expect(
      screen.queryByRole("combobox", { name: "Filter operator" })
    ).toBeNull();
    expect(screen.getByRole("combobox", { name: "Filter key" })).toBeVisible();
    expect(
      screen.getByRole("combobox", { name: "Filter key" }).getAttribute("value")
    ).toBe("String type");
  });

  it("handles backspace from value input", async () => {
    render(<Filter keys={keys} onSelect={mockOnSelect} />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "String type" }));
    await userEvent.click(screen.getByRole("option", { name: "equals (=)" }));

    expect(
      screen.queryByRole("combobox", { name: "Filter operator" })
    ).toBeNull();
    expect(screen.getByRole("textbox")).toBeVisible();

    await userEvent.keyboard("{Backspace}");

    expect(screen.queryByRole("textbox")).toBeNull();
    expect(
      screen.getByRole("combobox", { name: "Filter operator" })
    ).toBeVisible();
    expect(
      screen.getByRole("combobox", { name: "Filter operator" })
    ).toHaveValue("equals");
  });
});
