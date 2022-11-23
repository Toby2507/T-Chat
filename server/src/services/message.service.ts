import MessageModel from "../models/message.model";

export const addMessage = (message: string, to: string, from: string) => {
  return MessageModel.create({ message, users: [from, to], sender: from });
};

export const getChatMessages = (from: string, to: string) => {
  return MessageModel.find({ users: { $all: [from, to] } }).sort("updatedAt");
};