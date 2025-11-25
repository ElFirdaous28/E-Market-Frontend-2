// ProductManagement.test.js
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import { ProductManagement } from "../../../pages/Admin_pages/ProductManagement";
import { useAdminStatistics } from "../../../hooks/useAdminstatistics";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../../store/userSlice";

// Mock the hook
jest.mock("../../../hooks/useAdminstatistics");

// Activate axios mock
jest.mock("../../../services/axios");
const store = configureStore({
  reducer: { user: userReducer },
});
describe("ProductManagement Component", () => {
  const mockDeleteProduct = jest.fn();

  const mockProducts = [
  {
    _id: "10",
    title: "Keyboard",
    price: 99,
    stock: 20,
    categories: [{ _id: "c1", name: "Accessories" }]
  },
  {
    _id: "11",
    title: "Mouse",
    price: 25,
    stock: 50,
    categories: []
  },
];


  const queryClient = new QueryClient();

  const renderWithProviders = (ui) => {
    return render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  </Provider>
);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminStatistics.mockReturnValue({
      products: mockProducts,
      isLoading: false,
      deleteProduct: mockDeleteProduct,
    });
  });

  // Loading state test
  // it("renders loading state", () => {
  //   useAdminStatistics.mockReturnValue({
  //     products: [],
  //     isLoading: true,
  //   });

  //   renderWithProviders(<ProductManagement />);
  //   expect(screen.getByText("Loading...")).toBeInTheDocument();
  // });

  // Render products
  it("renders products correctly", () => {
    renderWithProviders(<ProductManagement />);

    expect(screen.getByText("Keyboard")).toBeInTheDocument();
    expect(screen.getByText("Mouse")).toBeInTheDocument();
  });

  // Delete product
  it("calls deleteProduct when delete button is clicked", async () => {
    renderWithProviders(<ProductManagement />);
    const user = userEvent.setup();

    // Your delete button must have `title="Delete Product"`
    await user.click(screen.getAllByTitle("Delete Product")[0]);

    expect(mockDeleteProduct).toHaveBeenCalledWith("10");
  });
});
