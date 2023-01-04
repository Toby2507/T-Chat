import { Request, Response } from 'express';
import { client, newMessage } from '../app';
import { addMessageInput, getMessagesInput, readUserMessagesInput } from '../schemas/message.schema';
import { addMessage, formatMessage, getChatMessages, readUserMessages } from '../services/message.service';

export const addMessageHandler = async (req: Request<{}, {}, addMessageInput>, res: Response) => {
  const { message, to } = req.body;
  const { _id: from } = res.locals.user;
  const msg = await addMessage(message, to, from);
  const newMsg = formatMessage(msg, from);
  const myOldMessages = await client.hGet(`user-${from}`, `messages-${to}`);
  const yourOldMessages = await client.hGet(`user-${to}`, `messages-${from}`);
  if (myOldMessages) {
    const myParsedMessages = myOldMessages && JSON.parse(myOldMessages);
    myParsedMessages.push(newMsg);
    await client.hSet(`user-${from}`, `messages-${to}`, JSON.stringify(myParsedMessages));
    if (yourOldMessages) {
      const yourParsedMessages = yourOldMessages && JSON.parse(yourOldMessages);
      yourParsedMessages.push({ ...newMsg, fromSelf: false });
      await client.hSet(`user-${to}`, `messages-${from}`, JSON.stringify(yourParsedMessages));
    }
  } else {
    await client.hSet(`user-${from}`, `messages-${to}`, JSON.stringify([newMsg]));
  }
  return res.status(201).json(newMsg);
};

export const getMessagesHandler = async (req: Request<getMessagesInput>, res: Response) => {
  const { to } = req.params;
  const { _id: from } = res.locals.user;
  const cachedMessages = await client.hGet(`user-${from}`, `messages-${to}`);
  if (cachedMessages) return res.json(JSON.parse(cachedMessages));
  const chatMessages = await getChatMessages(from, to);
  const messages = chatMessages.map(msg => formatMessage(msg, from));
  await client.hSet(`user-${from}`, `messages-${to}`, JSON.stringify(messages));
  return res.json(messages);
};

export const readUserMessagesHandler = async (req: Request<{}, {}, readUserMessagesInput>, res: Response) => {
  const { messages, to } = req.body;
  const { _id: from } = res.locals.user;
  const isUpdated = await readUserMessages(messages, from);
  const oldMessages = await client.hGet(`user-${from}`, `messages-${to}`);
  const parsedMessages = oldMessages && JSON.parse(oldMessages);
  const updatedMessages = parsedMessages.map((msg: newMessage) => {
    if (messages.includes(msg.id)) {
      msg.read = true;
      !msg.readers.includes(from) && msg.readers.push(from);
    }
    return msg;
  });
  await client.hSet(`user-${from}`, `messages-${to}`, JSON.stringify(updatedMessages));
  if (!isUpdated.acknowledged) return res.status(401).send();
  return res.status(204).send();
};