import GroupChatModel, { GroupChat } from "../models/groupChat.model";

export const createGroupChat = (input: Partial<GroupChat>) => {
  return GroupChatModel.create({ ...input });
};