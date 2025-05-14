import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import RegistrationForm from '../Pages/RegistrationForm/RegistrationForm.jsx';

// Mock fetch API
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 1, name: 'Test User' }),
  })
);

// Mock the dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Link: ({ to, children }) => <a href={to}>{children}</a>
}));

// Mock AuthContext
jest.mock('../Components/AuthContext.jsx', () => ({
  useAuth: () => ({
    login: jest.fn()
  })
}));

// Helper function to render the component with Router
const renderComponent = () => {
  return render(
    <BrowserRouter>
      <RegistrationForm />
    </BrowserRouter>
  );
};

describe('RegistrationForm Component', () => {
  
  // Reset mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // FUNCTIONALITY TESTS
  
  describe('Form Functionality Tests', () => {
    test('Form should render with correct initial state', () => {
      renderComponent();
      
      // Check title
      expect(screen.getByText('Join EventBloom')).toBeInTheDocument();
      
      // Check form elements are present
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      
      // Check role buttons
      expect(screen.getByText('Attendee')).toBeInTheDocument();
      expect(screen.getByText('Organizer')).toBeInTheDocument();
      
      // Check login link
      expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
      
      // Check register button
      expect(screen.getByText('Register')).toBeInTheDocument();
    });
    
    test('Form should update form data when inputs change', () => {
      renderComponent();
      
      // Fill form
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123' } });
      
      // Verify inputs have correct values
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com');
      expect(screen.getByLabelText(/Password/i)).toHaveValue('Password123');
    });
    
    test('Form should switch between attendee and organizer roles', () => {
      renderComponent();
      
      // Default should be attendee
      const attendeeButton = screen.getByText('Attendee');
      const organizerButton = screen.getByText('Organizer');
      
      // Switch to organizer
      fireEvent.click(organizerButton);
      
      // Switch back to attendee
      fireEvent.click(attendeeButton);
    });
  });
  
  // EQUIVALENCE PARTITIONING (EVP) TESTS
  
  describe('Equivalence Partitioning Tests', () => {
    
    // Valid inputs
    test('EVP1: Form should accept valid inputs', async () => {
      renderComponent();
      
      // Fill in form with valid data
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123' } });
      
      // Form should not show validation errors
      expect(screen.queryByText(/Please fill in/i)).not.toBeInTheDocument();
    });
    
    // Empty inputs
    test('EVP2: Form should not accept empty required fields', async () => {
      renderComponent();
      
      // Required attributes should be present on inputs
      expect(screen.getByLabelText(/Full Name/i)).toHaveAttribute('required');
      expect(screen.getByLabelText(/Email/i)).toHaveAttribute('required');
      expect(screen.getByLabelText(/Password/i)).toHaveAttribute('required');
    });
    
    // Invalid email format
    test('EVP3: Form should validate email format', async () => {
      renderComponent();
      
      // Confirm email field has email type for HTML5 validation
      expect(screen.getByLabelText(/Email/i)).toHaveAttribute('type', 'email');
    });
  });
  
  // BOUNDARY VALUE ANALYSIS (BVA) TESTS
  
  describe('Boundary Value Analysis Tests', () => {
    
    // Name field tests
    test('BVA1: Name field should accept minimum length input (1 character)', () => {
      renderComponent();
      
      // Fill name with minimum length
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'A' } });
      
      // Verify input is accepted
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue('A');
    });
    
    test('BVA2: Name field should accept long inputs (50 characters)', () => {
      renderComponent();
      
      const longName = 'A'.repeat(50);
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: longName } });
      
      // Verify input is accepted
      expect(screen.getByLabelText(/Full Name/i)).toHaveValue(longName);
    });
    
    // Password field tests
    test('BVA3: Password field should accept minimum length input (1 character)', () => {
      renderComponent();
      
      // Fill password with minimum length
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'A' } });
      
      // Verify input is accepted
      expect(screen.getByLabelText(/Password/i)).toHaveValue('A');
    });
    
    test('BVA4: Password field should accept long inputs (50 characters)', () => {
      renderComponent();
      
      const longPassword = 'A'.repeat(50);
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: longPassword } });
      
      // Verify input is accepted
      expect(screen.getByLabelText(/Password/i)).toHaveValue(longPassword);
    });
    
    // Email field tests
    test('BVA5: Email field should accept valid email with minimum length domain (a@b.co)', () => {
      renderComponent();
      
      // Fill email with minimum valid email
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@b.co' } });
      
      // Verify input is accepted
      expect(screen.getByLabelText(/Email/i)).toHaveValue('a@b.co');
    });
    
    test('BVA6: Email field should accept email with long local part (50 characters before @)', () => {
      renderComponent();
      
      const longLocalPart = 'a'.repeat(50);
      const email = `${longLocalPart}@example.com`;
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: email } });
      
      // Verify input is accepted
      expect(screen.getByLabelText(/Email/i)).toHaveValue(email);
    });
  });
  
  // FORM SUBMISSION TESTS
  
  describe('Form Submission Tests', () => {
    test('Form should call login and navigate on successful submission', async () => {
      // Setup navigation mock
      const navigateMock = jest.fn();
      jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
      
      // Setup auth mock
      const loginMock = jest.fn();
      jest.spyOn(require('../Components/AuthContext.jsx'), 'useAuth').mockReturnValue({
        login: loginMock
      });
      
      renderComponent();
      
      // Fill form with valid data
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123' } });
      
      // Submit form
      fireEvent.click(screen.getByText('Register'));
      
      // Wait for async operations
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    test('should show error when name contains numbers', () => {
      renderComponent();
      const nameInput = screen.getByLabelText(/Full Name/i);
      fireEvent.change(nameInput, { target: { value: 'John123' } });
      expect(screen.getByText(/Name cannot contain numbers/i)).toBeInTheDocument();
    });

    test('should show error when email username is all numbers', () => {
      renderComponent();
      const emailInput = screen.getByLabelText(/Email/i);
      fireEvent.change(emailInput, { target: { value: '12345@example.com' } });
      expect(screen.getByText(/Email username cannot consist of only numbers/i)).toBeInTheDocument();
    });
    
    test('Form should handle API errors correctly', async () => {
      console.log = jest.fn();

      global.fetch.mockImplementationOnce(() => Promise.reject(new Error('API Error')));
      
      renderComponent();
      
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password123' } });
      
      fireEvent.click(screen.getByText('Register'));
      
      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Error creating user',
          'API Error'
        );
      });
    });
  });
});
