import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IMessage } from '@/common/types';
import { v4 as uuidv4 } from 'uuid';

import { MessageModal } from '.';

const message: IMessage = {
  id: uuidv4(),
  email: 'john@doe.com',
  message: 'Just saying happy new year to all my loved friends.',
  subject: 'Happy new Year',
  createdAt: '2023-01-01T03:45:20',
};

it('should open confirmation modal when clicking the button', () => {
  const onClose = jest.fn();

  render(
    <MessageModal
      isOpen
      onClose={onClose}
      message={message}
      remove={onClose}
    />,
  );

  const remove = screen.getByRole('button', { name: /remove message/i });
  fireEvent.click(remove);

  expect(screen.getByText(/confirm action/i));
});

it('should close modal when clicking cancel', () => {
  const onClose = jest.fn();

  render(
    <MessageModal
      isOpen
      onClose={onClose}
      message={message}
      remove={onClose}
    />,
  );

  const cancel = screen.getByRole('button', { name: /cancel/i });
  fireEvent.click(cancel);
});

it('should call the delete message function by clicking on confirm', async () => {
  const onClose = jest.fn();
  const handleRemoveMessage = jest.fn();

  render(
    <MessageModal
      isOpen
      onClose={onClose}
      message={message}
      remove={handleRemoveMessage}
    />,
  );

  await waitFor(() => {
    const remove = screen.getByRole('button', { name: /remove message/i });
    fireEvent.click(remove);

    const confirm = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirm);
  });

  expect(handleRemoveMessage).toBeCalledWith(message.id);
});
