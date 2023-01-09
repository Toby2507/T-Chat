import { Request, Response } from 'express';
import { omit } from 'lodash';
import { privateFields } from '../models/user.model';
import { createGroupChatInput } from '../schemas/groupChat.schemas';
import { createGroupChat, getGroupChats } from '../services/groupChat.service';
import { getUserGroups, updateUsersGroupList } from '../services/user.service';

export const createGroupChatHandler = async (req: Request<{}, {}, createGroupChatInput>, res: Response) => {
  const { name, members, description } = req.body;
  const { _id: from } = res.locals.user;
  const groupChat = await createGroupChat({ userName: name, members, description: description || "", admins: [from] });
  await updateUsersGroupList(members, groupChat._id);
  return res.status(201).json(omit(groupChat.toJSON(), privateFields));
};

export const getGroupChatHandler = async (req: Request, res: Response) => {
  const { _id: from } = res.locals.user;
  const groups = await getUserGroups(from);
  const groupChats = await getGroupChats(groups?.groups as string[], from);
  const sanitizedGroupChats = groupChats.map(groupChat => omit(groupChat.toJSON(), privateFields));
  return res.status(200).json(sanitizedGroupChats);
};