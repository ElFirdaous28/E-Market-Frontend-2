import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../pages/Auth/Login";
import { BrowserRouter } from "react-router-dom";

// Mock useAuth to avoid calling real login API
jest.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    login: { mutateAsync: jest.fn(), isPending: false },
    user: null,
  }),
}));

let user;

beforeEach(() => {
  user = userEvent.setup();
  renderWithRouter(<Login />);
});


function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

test("Validate login form befor submit", async () => {

  // Select fields
  const emailInput = screen.getByPlaceholderText("jhon@example.com");
  const passwordInput = screen.getByPlaceholderText("••••••••");
  const submitBtn = screen.getByRole("button", { name: /sign in/i });

  // Type valid values
  await user.type(emailInput, "test@example.com");
  await user.type(passwordInput, "12345678");

  // Check button is enabled
  expect(submitBtn).toBeEnabled();
});

test("Shows error when email is invalid", async () => {

  const emailInput = screen.getByPlaceholderText("jhon@example.com");
  const submitBtn = screen.getByRole("button", { name: /sign in/i });

  // Type incorrect email
  await user.type(emailInput, "wrong-email");

  // Trigger validation
  await user.click(submitBtn);
  // Expect error
  expect(
    await screen.findByText("Invalid email address")
  ).toBeInTheDocument();
});

test("Shows Error when password is too short", async () => {
  const passwordInput = screen.getByPlaceholderText('••••••••');
  await user.type(passwordInput, "123");
  passwordInput.blur();

  expect(
    await screen.findByText("Password must be at least 6 characters")
  ).toBeInTheDocument();
})

test("Shows required flelds when sending empty form", async () => {
  const submitButton = screen.getByRole("button", { name: /sign in/i });
  await user.click(submitButton);

  expect(
    await screen.findByText("Email is required")
  ).toBeInTheDocument();
  expect(
    await screen.findByText("Password is required")
  ).toBeInTheDocument();
})