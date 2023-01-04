import dayjs from "dayjs";
import MessageModel, { Message } from "../models/message.model";

export const addMessage = (message: string, to: string, from: string) => {
  return MessageModel.create({ message, users: [from, to], sender: from });
};

export const getChatMessages = (from: string, to: string) => {
  return MessageModel.find({ users: { $all: [from, to] } }).sort("updatedAt");
};

export const readUserMessages = (messages: string[], user: string) => {
  return MessageModel.updateMany({ _id: { $in: messages }, users: user }, { $addToSet: { readers: user }, $set: { read: true } }, { multi: true });
};

export const formatMessage = (msg: Message, from: string) => {
  const over1week = dayjs().diff(msg.createdAt, 'week') > 1;
  return {
    id: msg._id,
    fromSelf: msg.sender?.toString() === from,
    message: msg.message,
    date: over1week ? dayjs(msg.createdAt).format('DD/MM/YYYY') : dayjs(msg.createdAt).format('dddd'),
    time: dayjs(msg.createdAt).format('h:mma'),
    read: msg.read,
    readers: msg.readers
  };
};