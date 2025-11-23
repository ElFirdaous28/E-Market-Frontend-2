import { render, screen, waitFor, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Cart from "../../pages/Cart";
import cartReducer from "../../store/cartSlice";
import userReducer from "../../store/userSlice";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

jest.mock("../../services/axios");
import axios from "../../services/axios";

// --- GLOBAL SPIES ---
const mockCreateOrder = jest.fn();
const mockNavigate = jest.fn();

// 2. Mock Router
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// 3. Mock External Hooks
jest.mock("../../hooks/useCoupons", () => ({
    useCoupons: () => ({
        validateCoupon: { mutate: jest.fn() }
    })
}));

jest.mock("../../hooks/useOrders", () => ({
    useOrders: () => ({
        createOrder: { mutate: mockCreateOrder }
    })
}));

// Mock useAuth (but NOT useAxios, so we can use the axios mock defined above)
jest.mock("../../hooks/useAuth", () => ({
    useAuth: jest.fn(),
}));

describe("Cart Integration Tests", () => {
    let store;
    let queryClient;
    const user = userEvent.setup();

    const renderCart = () => {
        return render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <Cart />
                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>
        );
    };

    // Wrapper for renderHook
    const createWrapper = () => ({ children }) => (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
    );

    beforeEach(() => {
        jest.clearAllMocks();

        store = configureStore({
            reducer: {
                cart: cartReducer,
                user: userReducer
            },
        });

        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
            logger: { log: console.log, warn: console.warn, error: () => { } },
        });

        useAuth.mockReturnValue({
            user: { _id: "user123", role: "user" }
        });
    });

    // Verify State Update
    it("Given a Cart component, When a product is added (Loads), Then the local state updates (Product added in cartSlice)", async () => {
        const mockCartData = {
            items: [
                {
                    _id: "item1",
                    productId: { _id: "p1", title: "Gaming Mouse", description: "Fast" },
                    quantity: 2
                }
            ]
        };
        const mockSummary = { total: 50, discount: 0, finalAmount: 50 };

        axios.get.mockResolvedValue({ data: { data: mockCartData } });
        axios.post.mockResolvedValue({ data: { data: { summary: mockSummary } } });

        renderCart();

        await waitFor(() => {
            expect(screen.getByText("Gaming Mouse")).toBeInTheDocument();
        });

        await waitFor(() => {
            const state = store.getState();
            expect(state.cart.items).toHaveLength(1);
            expect(state.cart.items[0].productId.title).toBe("Gaming Mouse");
            expect(state.cart.count).toBe(2);
        });
    });

    // Verify Quantity Logic
    it("Given a product in the cart, When the quantity is changed, Then the total is recalculated", async () => {
        const mockCartData = {
            items: [
                { _id: "item1", productId: { _id: "p1", title: "Laptop" }, quantity: 1 }
            ]
        };

        axios.get.mockResolvedValue({ data: { data: mockCartData } });
        axios.post.mockResolvedValue({ data: { data: { summary: { total: 1000, finalAmount: 1000 } } } });
        axios.put.mockResolvedValue({ data: { message: "Quantity updated" } });

        renderCart();

        const increaseBtn = await screen.findByRole("button", { name: "+" });
        await user.click(increaseBtn);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                "/cart",
                { productId: "p1", quantity: 2 }
            );
        });
    });

    // Verify Remove Item
    it("Given a product in the cart, When the delete button is clicked, Then the item disappears (Product removed from the cart).", async () => {
        const mockCartData = {
            items: [
                { _id: "item1", productId: { _id: "p1", title: "Bad Product" }, quantity: 1 }
            ]
        };

        axios.get.mockResolvedValue({ data: { data: mockCartData } });
        axios.post.mockResolvedValue({ data: { data: { summary: { total: 10, finalAmount: 10 } } } });
        axios.delete.mockResolvedValue({ data: { message: "Item removed" } });

        renderCart();

        await waitFor(() => expect(screen.getByText("Bad Product")).toBeInTheDocument());

        const buttons = screen.getAllByRole("button");
        const removeBtn = buttons.find(btn => btn.querySelector("svg.text-red-500"));

        if (removeBtn) await user.click(removeBtn);

        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith(
                "/cart",
                expect.objectContaining({ data: { productId: "p1" } })
            );
        });
    });

    // return cart items
    it("Given a cart with 2 products (via API), When useCart() is called, Then it returns the list of products and the total quantity", async () => {
        const mockItems = [
            { _id: "1", productId: { title: "Product A", price: 10 }, quantity: 2 },
            { _id: "2", productId: { title: "Product B", price: 20 }, quantity: 3 }
        ];

        axios.get.mockResolvedValue({ data: { data: { items: mockItems } } });
        axios.post.mockResolvedValue({ data: { data: { summary: { total: 80 } } } });

        const { result } = renderHook(() => useCart(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.cart.items).toHaveLength(2);
        expect(result.current.cart.items[0].productId.title).toBe("Product A");
        expect(result.current.cartLength).toBe(5);
    });

    // Verify Place Order / Checkout
    it("Place Order:Given a cart with 2 products, When the user clicks 'Checkout', Then an order is created via POST /orders and navigate", async () => {
        // Mock Cart Data
        const mockCartData = {
            items: [
                { _id: "i1", productId: { _id: "p1", title: "Item 1" }, quantity: 1 },
                { _id: "i2", productId: { _id: "p2", title: "Item 2" }, quantity: 2 }
            ]
        };
        const mockSummary = { total: 30, discount: 0, finalAmount: 30 };

        // Mock Loading Calls
        axios.get.mockResolvedValue({ data: { data: mockCartData } });
        axios.post.mockResolvedValue({ data: { data: { summary: mockSummary } } });

        // Mock Order Creation to Simulate Success
        mockCreateOrder.mockImplementation((payload, { onSuccess }) => {
            onSuccess({ data: { data: { _id: "order-123" } } });
        });

        renderCart();

        // Wait for items to load
        await waitFor(() => expect(screen.getByText("Item 1")).toBeInTheDocument());

        // Click "Checkout"
        // Use findByRole to wait for "Summary loading..." to finish and button to appear
        const checkoutBtn = await screen.findByRole("button", { name: /checkout/i });
        await user.click(checkoutBtn);

        // Verify Order Created
        await waitFor(() => {
            expect(mockCreateOrder).toHaveBeenCalledWith(
                expect.objectContaining({ coupons: [] }),
                expect.anything()
            );
        });

        // Verify Navigation
        expect(mockNavigate).toHaveBeenCalledWith("/orders");
    });
});