import { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';

import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Spinner,
  Th,
  Select,
  useToast,
  Flex,
} from '@chakra-ui/react';
import Template from '../components/Template';
import { IMessage } from '../common/types';

import { DangerConfirmation } from '../components/DangerConfirmation';
import { MessageModal } from '../components/MessageModal';
import { api } from '../services/api';

export default function Home() {
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const [subject, setSubject] = useState('');
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');

  const [sending, setSending] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState<IMessage>();
  const [messageIsOpen, setMessageIsOpen] = useState(false);

  const [removingId, setRemovingId] = useState<string>('');

  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const maxPerPage = 5;

  useEffect(() => {
    async function getData() {
      setLoading(true);

      try {
        const response = await api.get('messages');
        setMessages(response.data.messages);
      } catch (error) {
        toast({
          title: 'Error while fetching messages',
          description: error,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages) setPages(Math.ceil(messages.length / maxPerPage));
  }, [messages]);

  useEffect(() => {
    if (pages === 0) return;

    if (pages - 1 < page) {
      setPage(pages - 1);
    }
  }, [pages, page]);

  useEffect(() => {
    if (selectedMessage) {
      setMessageIsOpen(true);
      return;
    }

    setMessageIsOpen(false);
  }, [selectedMessage]);

  const convertAmPm = (date: string): string => {
    const dt = new Date(date);
    let hours = dt.getHours();
    const AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    const minutes = dt.getMinutes();
    const finalTime = `${hours}:${minutes} ${AmOrPm}`;
    return finalTime;
  };

  const handleRemoveMessage = async (id: string) => {
    setRemovingId(id);

    try {
      await api.delete(`messages/${id}`);

      setMessages(messages.filter((m) => m.id !== id));

      toast({
        status: 'success',
        title: 'Message removed successfully',
      });
    } catch (error) {
      toast({
        title: 'Something went wrong!',
        description: 'Error while deleting the contact',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setRemovingId('');
      onClose();
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const data = {
        email: recipient,
        message: content,
        subject,
        createdAt: new Date(),
      };

      const response = await api.post('/messages', data);

      const { message } = response.data;

      setMessages([...messages, message]);

      setRecipient('');
      setContent('');
      setSubject('');

      toast({
        status: 'success',
        title: 'Message sent successfully',
      });
    } catch (error) {
      toast({
        title: 'Error while creating message',
        description: error,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      onClose();
      setSending(false);
    }
  };

  const renderMessages = () => {
    return (
      <Table variant="striped" colorScheme="whiteAlpha">
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th>Subject</Th>
            <Th>Date</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {messages.length < 1 ? (
            <Tr>
              <Td colSpan={4}>
                <Text p="16px">Nenhuma messagem cadastrada.</Text>
              </Td>
            </Tr>
          ) : (
            messages
              .slice(page * maxPerPage, page * maxPerPage + maxPerPage)
              .map((message) => (
                <Tr
                  aria-label="opiton"
                  role="button"
                  key={message.id}
                  cursor="pointer"
                  _hover={{ bg: 'gray.900' }}
                  onClick={() => setSelectedMessage(message)}
                >
                  <Td>
                    <HStack spacing="16px">
                      <Avatar name={message.email} />
                      <Text>{message.email}</Text>
                    </HStack>
                  </Td>
                  <Td w="100%" fontWeight="600">
                    {message.subject}
                  </Td>
                  <Td whiteSpace="nowrap">
                    {message.createdAt?.substring(0, 10)} at{' '}
                    {convertAmPm(message.createdAt)}
                  </Td>
                  <Td>
                    <DangerConfirmation
                      buttonTrash
                      isLoading={removingId === message.id}
                      action={() => handleRemoveMessage(message.id)}
                    />
                  </Td>
                </Tr>
              ))
          )}
        </Tbody>
      </Table>
    );
  };

  return (
    <>
      <Head>
        <title>RBR Test</title>
      </Head>
      <Template>
        <MessageModal
          isOpen={messageIsOpen}
          onClose={() => setSelectedMessage(undefined)}
          message={selectedMessage}
          remove={handleRemoveMessage}
          isLoading={removingId === selectedMessage?.id}
        />

        <HStack justifyContent="space-between" mb="24px">
          <Heading data-test="heading" as="h2" fontSize="24px">
            Messages
          </Heading>
          <Box>
            <Button onClick={onOpen} colorScheme="blue">
              New Message
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent maxW="800px" bg="gray.800">
                <ModalHeader>New message</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl mb="24px">
                    <FormLabel>Subject</FormLabel>
                    <Input
                      bgColor="gray.900"
                      _hover={{ bgColor: 'gray.900' }}
                      variant="filled"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Recipient</FormLabel>
                    <Input
                      bgColor="gray.900"
                      _hover={{ bgColor: 'gray.900' }}
                      variant="filled"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="someone@mail.com"
                    />
                  </FormControl>

                  <FormControl mt="24px">
                    <FormLabel>My message</FormLabel>
                    <Textarea
                      bgColor="gray.900"
                      _hover={{ bgColor: 'gray.900' }}
                      variant="filled"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    isDisabled={!subject || !recipient || !content}
                    colorScheme="blue"
                    isLoading={sending}
                  >
                    Send message
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </HStack>

        {loading ? (
          <Flex p="24px" alignItems="center" justifyContent="center">
            <Spinner role="progressbar" />
          </Flex>
        ) : (
          renderMessages()
        )}

        {!loading && (
          <HStack justifyContent="flex-end" mt="24px">
            <Text>Page</Text>
            <Select
              data-testid="select"
              w="90px"
              value={page}
              onChange={(e) => setPage(parseInt(e.target.value))}
            >
              {Array.from({
                length: pages,
              }).map((_el, index) => (
                <option
                  data-testid="select-option"
                  key={index}
                  value={index}
                  style={{ background: '#1F2029', color: 'white' }}
                >
                  {index + 1}
                </option>
              ))}
            </Select>
          </HStack>
        )}
      </Template>
    </>
  );
}
