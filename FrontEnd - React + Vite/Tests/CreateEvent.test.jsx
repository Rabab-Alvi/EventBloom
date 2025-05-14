describe('CreateEvent Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useEvents.mockReturnValue({ addEvent: mockAddEvent });
    useAuth.mockReturnValue({
      user: { username: 'testUser' },
      getUserid: () => Promise.resolve(123),
    });

    render(
      <BrowserRouter>
        <CreateEvent />
      </BrowserRouter>
    );
  });

  test('can navigate through steps and submits event data successfully', async () => {
    fireEvent.change(screen.getByPlaceholderText(/Enter event name/i), {
      target: { value: 'Test Event' },
    });

    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2025-05-30' },
    });

    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: '15:30' },
    });

    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText(/Enter venue or address/i), {
        target: { value: 'Islamabad, Pakistan' },
      });

      fireEvent.change(screen.getByPlaceholderText(/Maximum number of attendees/i), {
        target: { value: '100' },
      });

      fireEvent.change(screen.getByPlaceholderText(/Describe your event/i), {
        target: { value: 'This is a test event description.' },
      });

      fireEvent.click(screen.getByText(/Next/i));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText(/Create Event/i));
    });

    await waitFor(() => {
      expect(mockAddEvent).toHaveBeenCalled();
      const calledWith = mockAddEvent.mock.calls[0][0];
      expect(calledWith.name).toBe('Test Event');
      expect(calledWith.date).toBe('2025-05-30');
      expect(calledWith.time).toBe('15:30');
      expect(calledWith.location).toBe('Islamabad, Pakistan');
      expect(calledWith.capacity).toBe('100');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/events');
  });

  test('shows validation error if event name is empty', async () => {
    fireEvent.change(screen.getByPlaceholderText(/Enter event name/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2025-05-30' },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: '15:30' },
    });

    fireEvent.click(screen.getByText(/Next/i));

    expect(await screen.findByText(/Event name is required/i)).toBeInTheDocument();
  });

  test('shows validation error if event name is numeric', async () => {
    fireEvent.change(screen.getByPlaceholderText(/Enter event name/i), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2025-05-30' },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: '15:30' },
    });

    fireEvent.click(screen.getByText(/Next/i));

    expect(await screen.findByText(/Event name cannot be numeric/i)).toBeInTheDocument();
  });

  test('shows validation error if date is empty', async () => {
    fireEvent.change(screen.getByPlaceholderText(/Enter event name/i), {
      target: { value: 'Valid Event' },
    });
    fireEvent.change(screen.getByLabelText(/Time/i), {
      target: { value: '15:30' },
    });

    fireEvent.click(screen.getByText(/Next/i));

    expect(await screen.findByText(/Event date is required/i)).toBeInTheDocument();
  });

  test('shows validation error if time is empty', async () => {
    fireEvent.change(screen.getByPlaceholderText(/Enter event name/i), {
      target: { value: 'Valid Event' },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2025-05-30' },
    });

    fireEvent.click(screen.getByText(/Next/i));

    expect(await screen.findByText(/Event time is required/i)).toBeInTheDocument();
  });

  test('shows capacity validation error for zero input', async () => {
    fireEvent.change(screen.getByPlaceholderText(/Enter event name/i), { target: { value: 'Valid Event' } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-05-30' } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '15:30' } });
    fireEvent.click(screen.getByText(/Next/i));

    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText(/Enter venue or address/i), { target: { value: 'Some Location' } });
      fireEvent.change(screen.getByPlaceholderText(/Maximum number of attendees/i), { target: { value: '0' } });
      fireEvent.change(screen.getByPlaceholderText(/Describe your event/i), { target: { value: 'Description text' } });
      fireEvent.click(screen.getByText(/Next/i));
    });

    const errorMessages = await screen.findAllByText(/Capacity must be a positive number|positive/i);
    expect(errorMessages.length).toBeGreaterThan(0);
  });
});
