import React, { ReactElement } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Box,
  Text,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { BiTrashAlt } from 'react-icons/bi';

type ButtonTypes = ReactElement | string;

interface Props {
  buttonText?: ButtonTypes;
  action: () => Promise<void>;
  isDisabled?: boolean;
  isLoading?: boolean;
  buttonTrash?: boolean;
}

export function DangerConfirmation({
  buttonText,
  isDisabled,
  isLoading,
  action,
  buttonTrash,
}: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const submit = async (): Promise<void> => {
    await action();
  };

  const renderButton = () => {
    return buttonTrash ? (
      <IconButton
        colorScheme="red"
        aria-label="remove"
        icon={<BiTrashAlt />}
        isLoading={isLoading}
        isDisabled={isDisabled}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      />
    ) : (
      <Button
        colorScheme="red"
        isDisabled={isDisabled}
        isLoading={isLoading}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <>
      {renderButton()}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          data-testid="danger-confirmation-modal"
          overflow="hidden"
          bg="gray.800"
        >
          <ModalHeader fontWeight="400" bg="gray.900" color="red.500">
            <HStack>
              <Box
                display="inline-block"
                p="4px"
                borderRadius="100%"
                bg="red.100"
                color="red.400"
              >
                <IoAlertCircleOutline size="24px" />
              </Box>
              <Text>Confirm action</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton
            color="red.500"
            fontSize="20px"
            top="15px"
            right="15px"
            _hover={{
              bg: 'red.100',
            }}
          />
          <ModalBody>
            <Text my="24px" fontSize="18px" textAlign="center">
              Are you sure you want to do this?
              <br />
              <strong>You can not undo this action.</strong>
            </Text>
          </ModalBody>

          <ModalFooter>
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
            <Button colorScheme="red" isLoading={isLoading} onClick={submit}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
