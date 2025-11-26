import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../store/userSlice";
import ProtectedRoute from "../../routes/ProtectedRoute";

// 1. Activate the manual mock
jest.mock("../../services/axios");
// 2. Import the mock so we can control it (mockImplementation)
import axios from "../../services/axios";

describe("Login Integration Tests - User Role Navigation", () => {

    let navigate;
    let store;
    let queryClient;

    const renderApp = (initialPath = "/profile", allowedRoles = ['admin']) => {
        render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter initialEntries={[initialPath]}>
                        <Routes>
                            <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
                                <Route path={initialPath} element={<h1>Protected Resource</h1>} />
                            </Route>

                            <Route path="/login" element={<h1>Login Page</h1>} />
                            <Route path="/unauthorized" element={<h1>Unauthorized Page</h1>} />
                        </Routes>
                    </MemoryRouter>
                </QueryClientProvider>
            </Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        navigate = jest.fn();
        /*eslint-disable*/
        require("react-router-dom").useNavigate.mockReturnValue(navigate);
        /*eslint-enable */
        store = configureStore({
            reducer: { user: userReducer },
        });

        // Create new QueryClient
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
            logger: { log: console.log, warn: console.warn, error: () => { } },
        });
    })
    describe("Test routes accessibility", () => {

        it("Given a JWT expired, When tryes to access /proile , Then he is redirected to /login", async () => {
            axios.post.mockRejectedValue(new Error("Token expired"));
            axios.get.mockRejectedValue(new Error("Token expired"));

            renderApp();
            // Verify Loading state appears first
            expect(screen.getByText("Loading...")).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.getByText("Login Page")).toBeInTheDocument();
            });

            // Verify Redux state is empty
            const state = store.getState();
            expect(state.user.user).toBeNull();
        });

        it("Given user ,When tryes to access admin route /usermanage,Then redirect to /unauthorized", async () => {
            const mockUserResponse = {
                data: {
                    user: { id: 1, fullname: "Simple User", role: "user" }
                }
            };
            const mockRefreshResponse = {
                data: { accessToken: "valid-token" }
            };
            // Initial Auth check succeeds
            axios.post.mockResolvedValue(mockRefreshResponse);
            axios.get.mockResolvedValue(mockUserResponse);
            // go to /usermanage
            renderApp("/usermanage", ['admin']);

            // Verify Loading first
            expect(screen.getByText("Loading...")).toBeInTheDocument();

            // Verify Redirect to Unauthorized
            await waitFor(() => {
                expect(screen.getByText("Unauthorized Page")).toBeInTheDocument();
            });

            const state = store.getState();
            expect(state.user.user.role).toBe("user");
        });

        it("Given a valid user (role='user'), When tries to access allowed route /cart, Then he sees the protected resource", async () => {
            const mockUserResponse = {
                data: { user: { id: 1, fullname: "Shopper", role: "user" } }
            };
            axios.post.mockResolvedValue({ data: { accessToken: "valid-token" } });
            axios.get.mockResolvedValue(mockUserResponse);

            // 2. Render /cart
            renderApp("/cart", ['user']);
            expect(screen.getByText("Loading...")).toBeInTheDocument();

            // Verify he actually sees the page (Protected Resource)
            await waitFor(() => {
                expect(screen.getByText("Protected Resource")).toBeInTheDocument();
            });

            // Verify NO redirects happened (Login/Unauthorized should NOT be there)
            expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
            expect(screen.queryByText("Unauthorized Page")).not.toBeInTheDocument();
        });
    });
});