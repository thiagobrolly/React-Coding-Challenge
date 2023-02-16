import {
  Avatar,
  Button,
  Heading,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { IMessage } from '@/common/types';
import { DangerConfirmation } from '../DangerConfirmation';

interface Props {
  message: IMessage;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  remove: (id: string) => Promise<void>;
}

export function MessageModal({
  message,
  isOpen,
  isLoading,
  onClose,
  remove,
}: Props) {
  const handleRemove = async (): Promise<void> => {
    await remove(message.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="500px" bg="gray.900">
        <ModalHeader>
          <HStack spacing="16px">
            <Avatar name={message?.email} />
            <Text>{message?.email}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading as="h2" fontSize="20px">
            {message?.subject}
          </Heading>
          <Text mt="24px">{message?.message}</Text>
        </ModalBody>

        <ModalFooter mt="32px">
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            _hover={{
              bg: 'gray.500',
            }}
          >
            Cancel
          </Button>

          <DangerConfirmation
            action={handleRemove}
            buttonText="Remove message"
            isLoading={isLoading}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
