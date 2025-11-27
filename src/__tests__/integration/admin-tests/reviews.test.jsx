import { render, screen, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import  AdminReviews  from "../../../pages/Admin_pages/Reviews";
import { useAdminStatistics } from "../../../hooks/useAdminstatistics";
import userEvent from "@testing-library/user-event";

// Mock the hook
jest.mock("../../../hooks/useAdminstatistics");
jest.mock("../../../services/axios");

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Trash2: () => <span>Trash</span>,
  Star: () => <span>Star</span>,
  MessageSquare: () => <span>Msg</span>,
  Check: () => <span>Check</span>,
  X: () => <span>X</span>,
  Edit2: () => <span>Edit</span>,
}));

// Mock axios if your hook uses it
jest.mock("../../../hooks/useAxios");

describe("AdminReviews Component", () => {
  const mockDeleteReview = jest.fn();
  const mockEditReview = jest.fn();
  const mockReviews = [
    {
      _id: "1",
      user: { fullname: "John Doe" },
      product: { title: "Wireless Headphones" },
      rating: 5,
      comment: "Excellent product!",
      status: "pending",
    },
    {
      _id: "2",
      user: { fullname: "Jane Smith" },
      product: { title: "Smart Watch" },
      rating: 4,
      comment: "Great watch!",
      status: "approved",
    },
  ];

  const queryClient = new QueryClient();

  const renderWithProviders = (ui) =>
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{ui}</BrowserRouter>
      </QueryClientProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminStatistics.mockReturnValue({
      reviews: mockReviews,
      deleteReview:mockDeleteReview,
      editReviewStatus:mockEditReview,
      isLoading: false,
    });
  });

  it("renders reviews and statistics correctly", () => {
    renderWithProviders(<AdminReviews />);

    // Check table data
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Smart Watch")).toBeInTheDocument();

    // Scoped checks for stats
    const totalCard = screen.getByText("Total Reviews").closest("div");
    expect(within(totalCard).getByText("2")).toBeInTheDocument();

    const pendingCard = screen.getByText("Pending").closest("div");
    expect(within(pendingCard).getByText("1")).toBeInTheDocument();

    const approvedCard = screen.getByText("Approved").closest("div");
    expect(within(approvedCard).getByText("1")).toBeInTheDocument();
  });
  it("calls deleteReview when delete button is clicked" , async () => {
    renderWithProviders(<AdminReviews/>);
    
    const user = userEvent.setup();
    
    await user.click(screen.getAllByTitle("Delete Review")[0]);
    expect(mockDeleteReview).toHaveBeenCalledWith("1");
  })
  
  it("editing review status", async () => {
    renderWithProviders(<AdminReviews/>); 
    const user = userEvent.setup(); 
    await user.click(screen.getAllByTitle("Edit Status")[0]); 
    const select = screen.getByDisplayValue("pending");
    await user.selectOptions(select, "approved");
    await user.click(screen.getByTitle("Save"));

    expect(mockEditReview).toHaveBeenCalledWith({id:"1", status:"approved"})
    
    
  })
});
