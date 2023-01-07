import { Request, Response } from 'express';
import { createGroupChatInput } from '../schemas/groupChat.schemas';
import { createGroupChat } from '../services/groupChat.service';
import { updateUsersGroupList } from '../services/user.service';

export const createGroupChatHandler = async (req: Request<{}, {}, createGroupChatInput>, res: Response) => {
  const { name, members, description } = req.body;
  const { _id: from } = res.locals.user;
  const groupChat = await createGroupChat({ name, members, description: description || "", admins: [from] });
  await updateUsersGroupList(members, groupChat._id);
  return res.status(201).json(groupChat);
};