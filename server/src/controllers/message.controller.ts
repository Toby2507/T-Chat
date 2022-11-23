import { Request, Response } from 'express';
import { addMessageInput, getMessagesInput } from '../schemas/message.schema';
import { addMessage, getChatMessages } from '../services/message.service';

export const addMessageHandler = async (req: Request<{}, {}, addMessageInput>, res: Response) => {
  const { message, to } = req.body;
  const { _id: from } = res.locals.user;
  await addMessage(message, to, from);
  return res.sendStatus(201);
};

export const getMessagesHandler = async (req: Request<getMessagesInput>, res: Response) => {
  const { to } = req.params;
  const { _id: from } = res.locals.user;
  const chatMessages = await getChatMessages(from, to);
  const messages = chatMessages.map(msg => ({
    id: msg._id,
    fromSelf: msg.sender?.toString() === from,
    message: msg.message
  }));
  return res.json(messages);
};