import { fireEvent, render, screen } from '@testing-library/react';
import { DangerConfirmation } from '.';

it('should display the text of the buttonText props on the button', () => {
  const action = jest.fn();

  render(<DangerConfirmation action={action} buttonText="Remove message" />);

  const buttonMessage = screen.getByRole('button', { name: /remove message/i });

  expect(buttonMessage).toBeInTheDocument();
});

it('should display the button with icon', () => {
  const action = jest.fn();

  render(<DangerConfirmation action={action} buttonTrash />);

  const buttonIcon = screen.getByRole('button', { name: /remove/i });

  expect(buttonIcon);
});

it('should open the confirmation modal when clicking on the remove button', () => {
  const action = jest.fn();

  render(<DangerConfirmation action={action} buttonText="Remove message" />);

  const openModal = screen.getByRole('button', { name: /remove message/i });
  fireEvent.click(openModal);

  expect(screen.getByText(/confirm action/i));
  expect(screen.getByRole('button', { name: /close/i }));
  expect(screen.getByText(/are you sure you want to do this\?/i));
  expect(screen.getByText(/you can not undo this action\./i));
  expect(screen.getByRole('button', { name: /cancel/i }));
  expect(screen.getByRole('button', { name: /confirm/i }));
});

it('should close the confirmation modal', async () => {
  const handleClose = jest.fn();

  render(
    <DangerConfirmation action={handleClose} buttonText="Remove message" />,
  );

  const openModal = screen.getByRole('button', { name: /remove message/i });
  fireEvent.click(openModal);

  const close = screen.getByRole('button', { name: /confirm/i });
  fireEvent.click(close);
});

it('should display disabled button', () => {
  const onClose = jest.fn();

  render(
    <DangerConfirmation
      action={onClose}
      buttonText="Remove message"
      isDisabled
    />,
  );

  const openModal = screen.getByRole('button', { name: /remove message/i });

  expect(openModal).toBeDisabled();
});
