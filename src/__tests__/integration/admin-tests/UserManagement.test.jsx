// UserManagement.test.js
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { UserManagement } from "../../../pages/Admin_pages/UserManagement";
import { useAdminStatistics } from "../../../hooks/useAdminstatistics";

// Mock the hook
jest.mock("../../../hooks/useAdminstatistics");

// Activate manual axios mock
jest.mock("../../../services/axios");
// import axios from "../../../services/axios";

describe("UserManagement Component", () => {
  const mockDeleteUser = jest.fn();
  const mockEditUserRole = jest.fn();

  const mockUsers = [
    { _id: "1", fullname: "Alice", email: "alice@example.com", role: "user" },
    { _id: "2", fullname: "Bob", email: "bob@example.com", role: "admin" },
    { _id: "3", fullname: "Charlie", email: "charlie@example.com", role: "seller" },
  ];

  const queryClient = new QueryClient();

  const renderWithProviders = (ui) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{ui}</BrowserRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminStatistics.mockReturnValue({
      users: mockUsers,
      isLoading: false,
      deleteUser: mockDeleteUser,
      editUserRole: mockEditUserRole,
    });
  });

  // Test loading state
  it("renders loading state", () => {
    useAdminStatistics.mockReturnValue({ users: [], isLoading: true });
    renderWithProviders(<UserManagement />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // Test stats and table render
  it("renders users and stats correctly", () => {
    renderWithProviders(<UserManagement />);

    // Stats - use heading + nextElementSibling to avoid duplicate numbers
    expect(screen.getByText("Total Users").nextElementSibling).toHaveTextContent("3");
    expect(screen.getByText("Admins").nextElementSibling).toHaveTextContent("1");
    expect(screen.getByText("Seller").nextElementSibling).toHaveTextContent("1");

    // Table
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  // Test edit role
  it("allows editing a user role", async () => {
    renderWithProviders(<UserManagement />);
    const user = userEvent.setup();

    await user.click(screen.getAllByTitle("Edit Role")[0]);

    const select = screen.getByDisplayValue("user");
    await user.selectOptions(select, "admin");

    await user.click(screen.getByTitle("Save"));

    expect(mockEditUserRole).toHaveBeenCalledWith({ id: "1", role: "admin" });
  });

  // Test cancel edit
  it("cancels editing a user role", async () => {
    renderWithProviders(<UserManagement />);
    const user = userEvent.setup();

    await user.click(screen.getAllByTitle("Edit Role")[0]);
    await user.click(screen.getByTitle("Cancel"));

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  // Test delete user
  it("calls deleteUser when delete button is clicked", async () => {
    renderWithProviders(<UserManagement />);
    const user = userEvent.setup();

    await user.click(screen.getAllByTitle("Delete User")[0]);
    expect(mockDeleteUser).toHaveBeenCalledWith("1");
  });
});
