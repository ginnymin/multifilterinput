import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Key } from "@lib/types";

import { KeySelector } from ".";

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

const mockOnChange = vi.fn();

describe("Components: KeySelector", () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders", () => {
    render(<KeySelector keys={keys} onChange={mockOnChange} />);

    expect(screen.getByRole("combobox", { name: "Filter key" })).toBeVisible();
    expect(screen.getByPlaceholderText("Add a filter...")).toBeVisible();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("renders key options", async () => {
    render(<KeySelector keys={keys} onChange={mockOnChange} />);

    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getAllByRole("option")).toHaveLength(keys.length);
  });

  it("renders with autofocus", async () => {
    render(<KeySelector keys={keys} onChange={mockOnChange} autoFocus />);

    await screen.findByRole("listbox");

    expect(screen.getByRole("listbox")).toBeVisible();
  });

  it("calls onChange", async () => {
    render(<KeySelector keys={keys} onChange={mockOnChange} />);

    await userEvent.type(screen.getByRole("combobox"), "String");
    await userEvent.keyboard("{Enter}");

    expect(mockOnChange).toHaveBeenCalledWith({
      id: "1",
      value: "String type",
    });
  });
});
