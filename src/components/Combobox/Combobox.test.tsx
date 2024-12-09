import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Combobox } from ".";

const options = [
  { id: "1", value: "Option 1" },
  { id: "2", value: "Option 2" },
  { id: "3", value: "Option 3" },
];

const mockOnChange = vi.fn();
const mockOnBackspace = vi.fn();
const mockOnRemoveOption = vi.fn();
describe("Components: Combobox", () => {
  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnBackspace.mockClear();
    mockOnRemoveOption.mockClear();
  });

  it("renders", () => {
    render(
      <Combobox
        label="Filter label"
        options={options}
        onChange={mockOnChange}
      />
    );

    expect(
      screen.getByRole("combobox", { name: "Filter label" })
    ).toBeVisible();
    expect(
      screen.getByRole("combobox", { name: "Filter label" })
    ).not.toHaveFocus();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("renders options", async () => {
    render(
      <Combobox
        label="Filter label"
        options={options}
        onChange={mockOnChange}
      />
    );

    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("renders options initially with autofocus", async () => {
    render(
      <Combobox
        label="Filter label"
        options={options}
        onChange={mockOnChange}
        autoFocus
      />
    );

    await screen.findByRole("listbox");

    expect(screen.getByRole("listbox")).toBeVisible();
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("closes listbox when clicking outside with autofocus", async () => {
    render(
      <div>
        <h2 data-testid="outside">Hello</h2>
        <Combobox
          label="Filter label"
          options={options}
          onChange={mockOnChange}
          autoFocus
        />
      </div>
    );

    await screen.findByRole("listbox");
    await userEvent.click(screen.getByTestId("outside"));

    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("does not close listbox when clicking input with autofocus", async () => {
    render(
      <div>
        <h2 data-testid="outside">Hello</h2>
        <Combobox
          label="Filter label"
          options={options}
          onChange={mockOnChange}
          autoFocus
        />
      </div>
    );

    await screen.findByRole("listbox");
    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).toBeVisible();
  });

  it("calls onChange", async () => {
    render(
      <Combobox
        label="Filter label"
        options={options}
        onChange={mockOnChange}
      />
    );

    await userEvent.type(screen.getByRole("combobox"), "1");
    await userEvent.keyboard("{Enter}");

    expect(mockOnChange).toHaveBeenCalledWith({ id: "1", value: "Option 1" });
  });

  it("calls onBackspace", async () => {
    render(
      <Combobox
        label="Filter label"
        options={options}
        onChange={mockOnChange}
        onBackspace={mockOnBackspace}
      />
    );

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.keyboard("{Backspace}");

    expect(mockOnBackspace).toHaveBeenCalledTimes(1);

    await userEvent.type(screen.getByRole("combobox"), "hi");
    await userEvent.keyboard("{Backspace}");
    await userEvent.keyboard("{Backspace}");
    await userEvent.keyboard("{Backspace}");

    expect(mockOnBackspace).toHaveBeenCalledTimes(2);
  });

  it("clears query after selection", async () => {
    render(
      <Combobox
        label="Filter label"
        options={options}
        onChange={mockOnChange}
      />
    );

    await userEvent.type(screen.getByRole("combobox"), "Option 1");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("clears query after selection for multiple", async () => {
    render(
      <Combobox
        label="Filter label"
        options={options}
        onChange={mockOnChange}
        multiple
      />
    );

    await userEvent.type(screen.getByRole("combobox"), "Option 1");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("renders with pre-selected option", () => {
    render(
      <Combobox
        label="Filter label"
        options={options}
        onChange={mockOnChange}
        selectedOptions={{ id: "1", value: "Option 1" }}
      />
    );

    expect(screen.getByRole("combobox")).toHaveValue("Option 1");
  });

  it("renders with pre-selected options", () => {
    render(
      <Combobox
        label="Filter label"
        options={options}
        onChange={mockOnChange}
        multiple
        selectedOptions={[
          { id: "1", value: "Option 1" },
          { id: "3", value: "Option 3" },
        ]}
      />
    );

    expect(screen.getByText("Option 1")).toBeVisible();
    expect(screen.getByText("Option 3")).toBeVisible();
    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("calls onRemoveOption", async () => {
    render(
      <Combobox
        label="Filter label"
        options={options}
        onChange={mockOnChange}
        onRemoveOption={mockOnRemoveOption}
        selectedOptions={[{ id: "1", value: "Option 1" }]}
        multiple
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(mockOnRemoveOption).toHaveBeenCalledWith({
      id: "1",
      value: "Option 1",
    });
  });

  it("calls onRemoveOption with backspace", async () => {
    render(
      <Combobox
        label="Filter label"
        options={options}
        onChange={mockOnChange}
        onRemoveOption={mockOnRemoveOption}
        selectedOptions={[{ id: "1", value: "Option 1" }]}
        multiple
      />
    );

    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.keyboard("{Backspace}");

    expect(mockOnRemoveOption).toHaveBeenCalledWith({
      id: "1",
      value: "Option 1",
    });
  });
});
