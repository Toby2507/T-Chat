import GroupChatModel, { GroupChat } from "../models/groupChat.model";

export const createGroupChat = (input: Partial<GroupChat>) => {
  return GroupChatModel.create({ ...input });
};

export const getGroupChats = (groupIds: string[], from: string) => {
  return GroupChatModel.find({ _id: { $in: groupIds }, members: { $in: from } });
};

export const leaveGroupChat = (groupId: string, userId: string) => {
  return GroupChatModel.updateOne({ _id: groupId }, { $pull: { members: userId, admins: userId } });
};

export const removeGroupMember = (groupId: string, userId: string, by: string) => {
  return GroupChatModel.updateOne({ _id: groupId, admins: by }, { $pull: { members: userId, admins: userId } });
};

export const deleteGroupChat = (groupId: string) => {
  return GroupChatModel.deleteOne({ _id: groupId });
};

export const editGroupInfo = (groupId: string, userName: string, description: string, by: string) => {
  return GroupChatModel.updateOne({ _id: groupId, admins: by }, { userName, description });
};

export const addNewUsersToGroup = (groupId: string, members: string[], by: string) => {
  return GroupChatModel.updateOne({ _id: groupId, admins: by }, { $addToSet: { members: { $each: members } } });
};

export const setGroupProfilePicture = (groupId: string, profilePicture: string, by: string) => {
  return GroupChatModel.updateOne({ _id: groupId, admins: by }, { profilePicture });
};

export const addNewAdminsToGroup = (groupId: string, admin: string, by: string) => {
  return GroupChatModel.updateOne({ _id: groupId, admins: by }, [{
    $set: {
      admins: {
        $cond: {
          if: { $in: [admin, "$admins"] },
          then: { $filter: { input: "$admins", as: "admin", cond: { $ne: ["$$admin", admin] } } },
          else: { $concatArrays: ["$admins", [admin]] }
        }
      }
    }
  }]);
};