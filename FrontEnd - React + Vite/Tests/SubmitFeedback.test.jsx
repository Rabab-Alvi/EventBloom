import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SubmitFeedback from '../Pages/SubmitFeedback/SubmitFeedback';
import '@testing-library/jest-dom';

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
);

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('SubmitFeedback Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the feedback form', () => {
    renderWithRouter(<SubmitFeedback />);
    expect(screen.getByText('We Value Your Feedback 💭')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('How would you rate your experience?')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Feedback')).toBeInTheDocument();
    expect(screen.getByLabelText('Allow us to share your feedback publicly')).toBeInTheDocument();
    expect(screen.getByText('Submit Feedback')).toBeInTheDocument();
  });

  test('validates empty fields', async () => {
    renderWithRouter(<SubmitFeedback />);
    fireEvent.click(screen.getByText('Submit Feedback'));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Please select a rating')).toBeInTheDocument();
      expect(screen.getByText('Feedback is required')).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    renderWithRouter(<SubmitFeedback />);
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getAllByRole('img')[2]);
    fireEvent.change(screen.getByLabelText('Your Feedback'), {
      target: { value: 'This is a test feedback message.' },
    });
    fireEvent.click(screen.getByText('Submit Feedback'));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  test('validates short feedback', async () => {
    renderWithRouter(<SubmitFeedback />);
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getAllByRole('img')[2]);
    fireEvent.change(screen.getByLabelText('Your Feedback'), { target: { value: 'Short' } });
    fireEvent.click(screen.getByText('Submit Feedback'));

    await waitFor(() => {
      expect(screen.getByText('Feedback must be at least 10 characters')).toBeInTheDocument();
    });
  });

  test('submits the form with valid data', async () => {
    renderWithRouter(<SubmitFeedback />);
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getAllByRole('img')[4]);
    fireEvent.change(screen.getByLabelText('Your Feedback'), {
      target: { value: 'This is an excellent feedback form. I really enjoyed using it!' },
    });
    fireEvent.click(screen.getByLabelText('Allow us to share your feedback publicly'));
    fireEvent.click(screen.getByText('Submit Feedback'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/feedback', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          rating: 5,
          feedback: 'This is an excellent feedback form. I really enjoyed using it!',
          isPublic: true,
        }),
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Thank You for Your Feedback!')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    renderWithRouter(<SubmitFeedback />);
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'jane@example.com' } });
    fireEvent.click(screen.getAllByRole('img')[3]);
    fireEvent.change(screen.getByLabelText('Your Feedback'), {
      target: { value: 'This is a test feedback with sufficient length.' },
    });
    fireEvent.click(screen.getByText('Submit Feedback'));

    await waitFor(() => {
      expect(screen.getByText('Failed to submit feedback. Please try again.')).toBeInTheDocument();
    });
  });

  test('clears error when user starts typing', async () => {
    renderWithRouter(<SubmitFeedback />);
    fireEvent.click(screen.getByText('Submit Feedback'));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'J' } });

    await waitFor(() => {
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });
  });

  test('validates name length', async () => {
    renderWithRouter(<SubmitFeedback />);
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'A' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getAllByRole('img')[2]);
    fireEvent.change(screen.getByLabelText('Your Feedback'), {
      target: { value: 'This is a proper feedback message.' },
    });
    fireEvent.click(screen.getByText('Submit Feedback'));

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  test('clears rating error when user selects a rating', async () => {
    renderWithRouter(<SubmitFeedback />);
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Your Feedback'), {
      target: { value: 'This is a valid test feedback message.' },
    });
    fireEvent.click(screen.getByText('Submit Feedback'));

    await waitFor(() => {
      expect(screen.getByText('Please select a rating')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('img')[2]);

    await waitFor(() => {
      expect(screen.queryByText('Please select a rating')).not.toBeInTheDocument();
    });
  });
});
