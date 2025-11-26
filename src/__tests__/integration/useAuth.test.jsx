import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import userReducer from "../../store/userSlice";

// Mock Axios
jest.mock("../../services/axios");

describe("useAuth Hook Unit Tests", () => {

    // Helper to create the Wrapper (Redux + React Query)
    const createWrapper = (preloadedState = {}) => {
        const store = configureStore({
            reducer: { user: userReducer },
            preloadedState,
        });

        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
            logger: { log: console.log, warn: console.warn, error: () => { } },
        });

        return function Wrapper({ children }) {
            return (
                <Provider store={store}>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </Provider>
            );
        };

    };

    it("Given a connected user in the Redux state, When useAuth() is called, Then it returns the correct information", () => {
        // Define existing user in Redux
        const mockUser = { id: 1, fullname: "Admin User", role: "admin" };
        const preloadedState = {
            user: {
                user: mockUser,
                accessToken: "fake-token",
                loading: false,
            },
        };

        // Render the hook with the Redux state
        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(preloadedState),
        });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.accessToken).toBe("fake-token");
    });

    // T-28
    it("Given a nono connected user in the Redux state, When useAuth() is called, Then it returns null", () => {
        //  Empty state (default)
        const preloadedState = {
            user: {
                user: null,
                accessToken: null,
                loading: false,
            },
        };

        const { result } = renderHook(() => useAuth(), {
            wrapper: createWrapper(preloadedState),
        });

        expect(result.current.user).toBeNull();
        expect(result.current.accessToken).toBeNull();
    });
});