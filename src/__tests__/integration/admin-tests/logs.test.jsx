import { render, screen } from "@testing-library/react";
import AdminActivities from "../../../pages/Admin_pages/logs";
// Mock the hook: useAdminStatistics
jest.mock("../../../hooks/useAdminstatistics", () => ({
  useAdminStatistics: () => ({
    activities: [
      {
        _id: "1",
        details: "Admin John created a product",
        createdAt: "2025-11-24T12:00:00Z",
      },
      {
        _id: "2",
        details: "Seller Jane updated a product",
        createdAt: "2025-11-23T15:00:00Z",
      },
    ],
  }),
}));

// Mock axios globally → FIXES the create() error
jest.mock("axios", () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    })),
  };
});

describe("AdminActivities Component", () => {
  test("renders the header text", () => {
    render(<AdminActivities />);

    expect(screen.getByText("Recent Activities")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Track all the latest actions and updates in your store"
      )
    ).toBeInTheDocument();
  });

  test("renders activities from mocked hook", () => {
    render(<AdminActivities />);

    // Activity details
    expect(
      screen.getByText("Admin John created a product")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Seller Jane updated a product")
    ).toBeInTheDocument();

    // Date format check
    expect(screen.getByText("24 Nov 2025")).toBeInTheDocument();
    expect(screen.getByText("23 Nov 2025")).toBeInTheDocument();
  });
});
