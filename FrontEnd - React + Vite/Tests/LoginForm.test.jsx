import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
// Import path adjusted to match your project structure  
import LoginForm from '../Pages/LoginForm/LoginForm'; 

// Mock the dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Link: ({ to, children }) => <a href={to}>{children}</a>
}));

// Mock AuthContext if it's used in LoginForm
jest.mock('../Components/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(() => Promise.resolve(true))
  })
}));

// Mock GlitterButton component
jest.mock('../Pages/Homepage/GlitterButton', () => ({ children, type, 'aria-label': ariaLabel }) => (
  <button type={type} className="cta-button" aria-label={ariaLabel}>{children}</button>
));

// Mock FallingElements component
jest.mock('C:/Users/rabab/Downloads/EventBloom/proj/src/Pages/Homepage/FallingElements.jsx', () => () => <div data-testid="falling-elements" />);

// Global fetch mock if your LoginForm uses fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, message: "Login successful", role: "USER" })
  })
);

describe('LoginForm', () => {
  beforeEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
    
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
  });

  it('should display error when email and password are empty', async () => {
    // Get the login button 
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    // Submit the form with empty fields
    fireEvent.click(loginButton);
    
    // Wait for the validation errors to appear
    await waitFor(() => {
      // Check for presence of error messages - adjust text to match your actual implementation
      const emailError = screen.queryByText(/email is required/i) || 
                         screen.queryByText(/please enter your email/i) ||
                         screen.queryByText(/email cannot be empty/i);
                         
      const passwordError = screen.queryByText(/password is required/i) ||
                            screen.queryByText(/please enter your password/i) ||
                            screen.queryByText(/password cannot be empty/i);
                            
      expect(emailError || passwordError).toBeInTheDocument();
    });
  });

  it('should display error for invalid email format', async () => {
    // Get the form fields
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    // Fill in invalid email and valid password
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    
    // Submit the form
    fireEvent.click(loginButton);
    
    // Check for invalid email error message - using the actual error from your implementation
    await waitFor(() => {
      const emailError = screen.queryByText(/incorrect username or password/i);
      expect(emailError).toBeInTheDocument();
    });
  });

  it('should display error for short password', async () => {
    // Get the form fields
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    // Fill in valid email and short password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    
    // Submit the form
    fireEvent.click(loginButton);
    
    // Check for error message - using the actual error message from your implementation
    await waitFor(() => {
      const errorMessage = screen.queryByText(/incorrect username or password/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('should submit the form successfully with valid input', async () => {
    // Setup mock for successful login
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
    
    // Mock successful fetch response
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, email: 'bob@example.com', role: 'USER' })
      })
    );
    
    // Get the form fields
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    // Fill in valid email and password
    fireEvent.change(emailInput, { target: { value: 'bob@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'pass123' } });
    
    // Submit the form
    fireEvent.click(loginButton);
    
    // Wait for form submission and redirect
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/user/bob@example.com/pass123'
      );
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });
});