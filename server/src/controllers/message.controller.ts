import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { addMessageInput, getMessagesInput } from '../schemas/message.schema';
import { addMessage, getChatMessages } from '../services/message.service';

export const addMessageHandler = async (req: Request<{}, {}, addMessageInput>, res: Response) => {
  const { message, to } = req.body;
  const { _id: from } = res.locals.user;
  const msg = await addMessage(message, to, from);
  const over1week = dayjs().diff(msg.createdAt, 'week') > 1;
  const newMsg = {
    id: msg._id,
    fromSelf: msg.sender?.toString() === from,
    message: msg.message,
    date: over1week ? dayjs(msg.createdAt).format('DD/MM/YYYY') : dayjs(msg.createdAt).format('dddd'),
    time: dayjs(msg.createdAt).format('h:mma')
  };
  return res.status(201).json(newMsg);
};

export const getMessagesHandler = async (req: Request<getMessagesInput>, res: Response) => {
  const { to } = req.params;
  const { _id: from } = res.locals.user;
  const chatMessages = await getChatMessages(from, to);
  const messages = chatMessages.map(msg => {
    const over1week = dayjs().diff(msg.createdAt, 'week') > 1;
    return {
      id: msg._id,
      fromSelf: msg.sender?.toString() === from,
      message: msg.message,
      date: over1week ? dayjs(msg.createdAt).format('DD/MM/YYYY') : dayjs(msg.createdAt).format('dddd'),
      time: dayjs(msg.createdAt).format('h:mma')
    };
  });
  return res.json(messages);
};