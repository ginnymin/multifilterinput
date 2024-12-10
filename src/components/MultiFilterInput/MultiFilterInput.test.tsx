import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MultiFilterInput, type Key, type OperatorDefinition } from ".";

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

const operators: OperatorDefinition[] = [
  { id: "matches", value: "matches", types: ["string", "number", "select"] },
  { id: "earlier", value: "is earlier than", types: ["date"] },
  { id: "later", value: "is later than", types: ["date"] },
  { id: "contains", value: "contains", types: ["multiselect"] },
];

const mockOnChange = vi.fn();

describe("Components: MultiFilterInput", () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders", () => {
    render(<MultiFilterInput keys={keys} onChange={mockOnChange} />);

    expect(screen.getByRole("combobox", { name: "Filter key" })).toBeVisible();
    expect(screen.getByPlaceholderText("Add a filter...")).toBeVisible();
  });

  it("renders keys", async () => {
    render(<MultiFilterInput keys={keys} onChange={mockOnChange} />);

    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getAllByRole("option")).toHaveLength(keys.length);
  });

  it("renders default operators", async () => {
    render(<MultiFilterInput keys={keys} onChange={mockOnChange} />);

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "String type" }));

    expect(screen.getAllByRole("option")).toHaveLength(6);
  });

  it("renders custom operators", async () => {
    render(
      <MultiFilterInput
        keys={keys}
        operators={operators}
        onChange={mockOnChange}
      />
    );

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Date type" }));

    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("renders filter chip", async () => {
    render(<MultiFilterInput keys={keys} onChange={mockOnChange} />);

    await userEvent.type(screen.getByRole("combobox"), "Number");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(screen.getByRole("combobox"), "equals");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(screen.getByRole("spinbutton"), "1");
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "Remove" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Number type = 1" })
    ).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Filter key" })).toBeVisible();
  });

  it("renders multple filter chips", async () => {
    render(<MultiFilterInput keys={keys} onChange={mockOnChange} />);

    await userEvent.type(screen.getByRole("combobox"), "String");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(screen.getByRole("combobox"), "!=");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(screen.getByRole("textbox"), "Hello");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByRole("combobox"), "Number");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(screen.getByRole("combobox"), "equals");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(screen.getByRole("spinbutton"), "1");
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Escape}");

    expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "String type != Hello" })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Number type = 1" })
    ).toBeVisible();
  });

  it("removes filter chip", async () => {
    render(<MultiFilterInput keys={keys} onChange={mockOnChange} />);

    await userEvent.type(screen.getByRole("combobox"), "String");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(screen.getByRole("combobox"), "!=");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(screen.getByRole("textbox"), "Hello");
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Escape}");
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("edits filter", async () => {
    render(<MultiFilterInput keys={keys} onChange={mockOnChange} />);

    await userEvent.type(screen.getByRole("combobox"), "String");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(screen.getByRole("combobox"), "=");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(screen.getByRole("textbox"), "Hi");
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{Escape}");
    await userEvent.click(
      screen.getByRole("button", { name: "String type = Hi" })
    );
    await userEvent.keyboard("{Backspace}");
    await userEvent.keyboard("{Backspace}");
    await userEvent.keyboard("{Backspace}");

    await userEvent.keyboard("{Backspace}");
    await userEvent.keyboard("{Backspace}");
    await userEvent.click(screen.getByRole("option", { name: /!=/ }));

    await userEvent.keyboard("{Backspace}");
    await userEvent.keyboard("{Backspace}");
    await userEvent.type(screen.getByRole("textbox"), "Goodbye");
    await userEvent.keyboard("{Enter}");

    expect(
      screen.getByRole("button", { name: "String type != Goodbye" })
    ).toBeVisible();
  });
});
