import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Home from '../pages';

describe('<Home />', () => {
  const handlers = [
    rest.get('*/messages', async (req, res, ctx) => {
      return res(
        ctx.json({
          messages: [
            {
              id: '1',
              email: 'john@doe.com',
              message: 'Just saying happy new year to all my loved friends.',
              subject: 'Happy new Year',
              createdAt: '2023-01-01T13:45:20',
            },
          ],
        }),
      );
    }),

    rest.post('*/messages', async (req, res, ctx) => {
      return res(
        ctx.json({
          message: {
            id: '2',
            email: 'michael.scott@hotmail.com',
            message: 'That was what she said',
            subject: 'Quote of the day',
            createdAt: '2023-02-15T09:58:20.112Z',
          },
        }),
      );
    }),

    rest.delete('*/messages/:id', async (req, res, ctx) => {
      const { id } = req.params;

      return res(
        ctx.json({
          id,
          email: 'john@doe.com',
          message: 'Just saying happy new year to all my loved friends.',
          subject: 'Happy new Year',
          createdAt: '2023-01-01T03:45:20',
        }),
      );
    }),
  ];

  const server = setupServer(...handlers);
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    server.close();
  });

  it('should display a registered message', async () => {
    render(<Home />);

    const loading = screen.getByRole('progressbar');

    await waitForElementToBeRemoved(loading);

    const subject = screen.getByRole('cell', { name: /Happy new Year/i });

    expect(subject).toBeInTheDocument();
  });

  it('should delete a message', async () => {
    render(<Home />);

    const loading = screen.getByRole('progressbar');

    await waitForElementToBeRemoved(loading);

    const subject = screen.getByRole('cell', { name: /Happy new Year/i });
    const btnRemove = screen.getByRole('button', { name: /remove/i });

    expect(subject).toBeInTheDocument();
    expect(btnRemove).toBeInTheDocument();

    fireEvent.click(btnRemove);

    const btnConfirm = screen.getByRole('button', { name: /confirm/i });
    expect(btnConfirm).toBeInTheDocument();

    fireEvent.click(btnConfirm);

    const btnLoading = screen.getByRole('button', {
      name: /loading\.\.\. confirm/i,
    });
    expect(btnLoading).toBeDisabled();

    await waitForElementToBeRemoved(btnLoading);

    expect(
      screen.getByText(/nenhuma messagem cadastrada\./i),
    ).toBeInTheDocument();
  });

  it('should register a message', async () => {
    render(<Home />);

    const loading = screen.getByRole('progressbar');

    await waitForElementToBeRemoved(loading);

    const btnNewMessage = screen.getByRole('button', { name: /new message/i });
    fireEvent.click(btnNewMessage);

    const subject = screen.getByRole('textbox', {
      name: /subject/i,
    }) as HTMLInputElement;
    const recipient = screen.getByRole('textbox', {
      name: /recipient/i,
    }) as HTMLInputElement;
    const message = screen.getByRole('textbox', {
      name: /my message/i,
    }) as HTMLInputElement;
    const btnCancel = screen.getByRole('button', { name: /cancel/i });
    const btnMessage = screen.getByRole('button', { name: /send message/i });

    const recipientRes = 'michael.scott@hotmail.com';
    const subjectRes = 'Quote of the day';
    const messageRes = 'That was what she said';

    expect(subject).toHaveAttribute('value', '');
    expect(recipient).toHaveAttribute('value', '');
    expect(message).toBeInTheDocument();
    expect(btnCancel).toBeInTheDocument();
    expect(btnMessage).toBeDisabled();

    fireEvent.change(subject, { target: { value: subjectRes } });
    expect(subject.value).toBe(subjectRes);
    fireEvent.change(recipient, { target: { value: recipientRes } });
    expect(recipient.value).toBe(recipientRes);
    fireEvent.change(message, { target: { value: messageRes } });
    expect(message.value).toBe(messageRes);

    expect(btnMessage).toBeEnabled();

    fireEvent.click(btnMessage);

    expect(btnMessage).toHaveAttribute('data-loading');
    expect(btnMessage).toBeDisabled();

    await waitForElementToBeRemoved(btnMessage);

    expect(
      screen.getByRole('cell', {
        name: /michael\.scott@hotmail\.com michael\.scott@hotmail\.com/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: subjectRes })).toBeInTheDocument();

    // debug();
  });

  it('should open the modal of the selected message', async () => {
    render(<Home />);

    const loading = screen.getByRole('progressbar');

    await waitForElementToBeRemoved(loading);

    const subject = screen.getByRole('cell', { name: /Happy new Year/i });
    const teste = screen.getByRole('button', { name: /opiton/i });

    expect(subject).toBeInTheDocument();
    expect(teste).toBeInTheDocument();

    fireEvent.click(teste);

    const closeModal = screen.getByRole('button', { name: /close/i });

    expect(
      screen.getByText(/Just saying happy new year to all my loved friends\./i),
    ).toBeInTheDocument();

    fireEvent.click(closeModal);

    await waitForElementToBeRemoved(closeModal);
  });
});

describe('<Home /> -> multiple registered messages', () => {
  const handlers = [
    rest.get('*/messages', async (req, res, ctx) => {
      return res(
        ctx.json({
          messages: [
            {
              id: '1',
              email: 'john@doe.com',
              message: 'Just saying happy new year to all my loved friends.',
              subject: 'Happy new Year',
              createdAt: '2023-01-01T13:45:20',
            },
            {
              id: '2',
              email: 'john@doe.com',
              message: 'Just saying happy new year to all my loved friends.',
              subject: 'Happy new Year',
              createdAt: '2023-01-01T13:45:20',
            },
            {
              id: '3',
              email: 'john@doe.com',
              message: 'Just saying happy new year to all my loved friends.',
              subject: 'Happy new Year',
              createdAt: '2023-01-01T13:45:20',
            },
            {
              id: '4',
              email: 'john@doe.com',
              message: 'Just saying happy new year to all my loved friends.',
              subject: 'Happy new Year',
              createdAt: '2023-01-01T13:45:20',
            },
            {
              id: '5',
              email: 'john@doe.com',
              message: 'Just saying happy new year to all my loved friends.',
              subject: 'Happy new Year',
              createdAt: '2023-01-01T13:45:20',
            },
            {
              id: '6',
              email: 'john@doe.com',
              message: 'Just saying happy new year to all my loved friends.',
              subject: 'Happy new Year',
              createdAt: '2023-01-01T13:45:20',
            },
          ],
        }),
      );
    }),
  ];

  const server = setupServer(...handlers);
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    server.close();
  });

  it('should display the first page', async () => {
    render(<Home />);

    const loading = screen.getByRole('progressbar');

    await waitForElementToBeRemoved(loading);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });
    expect(screen.getAllByRole('option').length).toBe(2);

    const option1 = screen.getByRole('option', {
      name: '1',
    }) as HTMLOptionElement;
    const option2 = screen.getByRole('option', {
      name: '2',
    }) as HTMLOptionElement;

    expect(option1.selected).toBe(true);
    expect(option2.selected).toBe(false);
  });
});
