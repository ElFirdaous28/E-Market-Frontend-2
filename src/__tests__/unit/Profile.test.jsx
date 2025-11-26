import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Profile from "../../pages/Profile";
import { useAuth } from "../../hooks/useAuth";
import { useAxios } from "../../hooks/useAxios";
import { toast } from "react-toastify";
import { BrowserRouter } from "react-router-dom";

// Mock Dependencies
jest.mock("../../hooks/useAuth", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../hooks/useAxios", () => ({
    useAxios: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
}));

// Mock createObjectURL
/*eslint-disable*/
global.URL.createObjectURL = jest.fn();
/*eslint-enable*/
describe("Profile Component Unit Tests", () => {

    const renderProfile = () => {
        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );
    };
    const mockPatch = jest.fn();
    const mockDelete = jest.fn();
    const mockNavigate = jest.fn();
    const user = userEvent.setup();

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup Mocks
        /*eslint-disable*/
        require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
        /*eslint-enable */

        useAxios.mockReturnValue({
            patch: mockPatch,
            delete: mockDelete,
        });

        // Default User State
        useAuth.mockReturnValue({
            user: {
                _id: "123",
                fullname: "John Doe",
                email: "john@example.com",
                avatar: "/uploads/avatar.jpg",
            },
        });
        renderProfile();
    });

    describe("Validation Scenarios", () => {
        it("Shows error when required fields are empty", async () => {


            const nameInput = screen.getByLabelText(/Full Name/i);
            const emailInput = screen.getByLabelText(/Email Address/i);
            const saveButton = screen.getByRole("button", { name: /Save/i });

            // Clear inputs
            await user.clear(nameInput);
            await user.clear(emailInput);

            // Try to submit
            await user.click(saveButton);

            // Assert Errors Appear
            expect(await screen.findByText("Full name required")).toBeInTheDocument();
            expect(await screen.findByText("Email required")).toBeInTheDocument();

            // Assert API was NOT called
            expect(mockPatch).not.toHaveBeenCalled();
        });

        it("Shows error when format is invalid (Min length, Invalid Email)", async () => {

            const nameInput = screen.getByLabelText(/Full Name/i);
            const emailInput = screen.getByLabelText(/Email Address/i);
            const passwordInput = screen.getByLabelText(/Password/i);
            const saveButton = screen.getByRole("button", { name: /Save/i });

            // Enter Invalid Data
            await user.clear(nameInput);
            await user.type(nameInput, "Jo");
            await user.tab();

            await user.clear(emailInput);
            await user.type(emailInput, "not-an-email");
            await user.tab();

            await user.type(passwordInput, "123");
            await user.tab();

            await user.click(saveButton);

            // Assert Validation Messages
            expect(await screen.findByText("Min 3 chars")).toBeInTheDocument();
            expect(await screen.findByText("Invalid email")).toBeInTheDocument();
            expect(await screen.findByText("Min 6 chars")).toBeInTheDocument();

            expect(mockPatch).not.toHaveBeenCalled();
        });
    });

    describe("Success Scenarios", () => {
        it("Submits the form when data is valid", async () => {
            mockPatch.mockResolvedValue({ data: { success: true } });

            const nameInput = screen.getByLabelText(/Full Name/i);
            const saveButton = screen.getByRole("button", { name: /Save/i });

            // Change Name
            await user.clear(nameInput);
            await user.type(nameInput, "Jane Doe");

            // Submit
            await user.click(saveButton);

            // Verify API Call
            await waitFor(() => {
                expect(mockPatch).toHaveBeenCalledWith(
                    "users/123",
                    expect.any(FormData), // Verifies FormData is sent
                    expect.any(Object)
                );
            });

            // Verify Success Toast
            expect(toast.success).toHaveBeenCalledWith("Profile Updated");
        });

        it("Handles Account Deletion", async () => {
            // Mock window.confirm to return true
            const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
            mockDelete.mockResolvedValue({});

            // Click Delete
            const deleteButton = screen.getByRole("button", { name: /Delete Account/i });
            await user.click(deleteButton);

            // Verify API Call
            expect(confirmSpy).toHaveBeenCalled();

            await waitFor(() => {
                expect(mockDelete).toHaveBeenCalledWith("users/123");
            });

            // Verify Redirect and Toast
            expect(mockNavigate).toHaveBeenCalledWith("/");
            expect(toast.success).toHaveBeenCalledWith("Account deleted successfully");

            confirmSpy.mockRestore();
        });
    });
});