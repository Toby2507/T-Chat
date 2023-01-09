import GroupChatModel, { GroupChat } from "../models/groupChat.model";

export const createGroupChat = (input: Partial<GroupChat>) => {
  return GroupChatModel.create({ ...input });
};

export const getGroupChats = (groupIds: string[], from: string) => {
  return GroupChatModel.find({ _id: { $in: groupIds }, members: { $in: from } });
};