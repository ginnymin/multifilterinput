import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Chip } from ".";

const mockOnRemove = vi.fn();
const mockOnSelect = vi.fn();

describe("Components: Chip", () => {
  beforeEach(() => {
    mockOnRemove.mockClear();
    mockOnSelect.mockClear();
  });

  it("renders chip", () => {
    render(<Chip>Test label</Chip>);

    expect(screen.getByText("Test label")).toBeVisible();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Test label")).toHaveClass("bg-gray-300");
  });

  it("renders remove button and calls onRemove", async () => {
    render(<Chip onRemove={mockOnRemove}>Test label</Chip>);

    expect(screen.getByRole("button", { name: "Remove" })).toBeVisible();
    expect(screen.getByText("Test label")).toHaveClass("bg-gray-300");

    await userEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it("renders select button and calls onSelect", async () => {
    render(<Chip onSelect={mockOnSelect}>Test label</Chip>);

    expect(screen.getByRole("button", { name: "Test label" })).toBeVisible();
    expect(screen.getByText("Test label").parentElement).toHaveClass(
      "bg-blue-600"
    );

    await userEvent.click(screen.getByRole("button", { name: "Test label" }));

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it("renders both select and remove buttons", () => {
    render(
      <Chip onSelect={mockOnSelect} onRemove={mockOnRemove}>
        Test label
      </Chip>
    );

    expect(screen.getByRole("button", { name: "Test label" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Remove" })).toBeVisible();
  });
});
