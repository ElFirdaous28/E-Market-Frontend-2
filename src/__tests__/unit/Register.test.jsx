import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../../pages/Auth/Register';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuth to avoid real API calls
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    register: { mutateAsync: jest.fn(), isPending: false },
  }),
}));

let user;

// Helper to wrap component with BrowserRouter
function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

// Setup before each test
beforeEach(() => {
  user = userEvent.setup();
  renderWithRouter(<Register />);
});

// Test valid input enables submit
test('Validate register form before submit', async () => {
  const fullnameInput = screen.getByPlaceholderText('John Doe');
  const emailInput = screen.getByPlaceholderText('john@example.com');
  const passwordInputs = screen.getAllByPlaceholderText('••••••••');
  const passwordInput = passwordInputs[0];
  const confirmPasswordInput = passwordInputs[1];

  const submitBtn = screen.getByRole('button', { name: /sign up/i });

  await user.type(fullnameInput, 'Test User');
  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, '12345678');
  await user.type(confirmPasswordInput, '12345678');

  expect(submitBtn).toBeEnabled();
});

// Test invalid email shows error
test('Shows error when email is invalid', async () => {
  const emailInput = screen.getByPlaceholderText('john@example.com');
  const submitBtn = screen.getByRole('button', { name: /sign up/i });

  await user.type(emailInput, 'wrong-email');
  await user.click(submitBtn);

  expect(await screen.findByText('Invalid email')).toBeInTheDocument();
});

// Test short password shows error
test('Shows error when password is too short', async () => {
  const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
  await user.type(passwordInput, '123');
  passwordInput.blur();

  expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();
});

// Test confirm password mismatch shows error
test('Shows error when passwords do not match', async () => {
  const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
  const confirmPasswordInput = screen.getAllByPlaceholderText('••••••••')[1];

  await user.type(passwordInput, '12345678');
  await user.type(confirmPasswordInput, '87654321');
  confirmPasswordInput.blur();

  expect(await screen.findByText('Passwords must match')).toBeInTheDocument();
});

// Test submitting empty form shows required field errors
test('Shows required field errors when form is empty', async () => {
  const submitBtn = screen.getByRole('button', { name: /sign up/i });
  await user.click(submitBtn);

  expect(await screen.findByText('Full Name is required')).toBeInTheDocument();
  expect(await screen.findByText('Email is required')).toBeInTheDocument();
  expect(await screen.findByText('Password is required')).toBeInTheDocument();
  expect(await screen.findByText('Confirm Password is required')).toBeInTheDocument();
});
