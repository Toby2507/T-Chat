import UserModel, { User } from "../models/user.model";

export const createUser = (input: Partial<User>) => {
    return UserModel.create({ ...input });
};

export const findUserByUsername = (userName: string) => {
    return UserModel.findOne({ userName });
};

export const findUserByEmail = (email: string) => {
    return UserModel.findOne({ email });
};

export const findUserById = (id: string) => {
    return UserModel.findById(id);
};

export const findUserByRefeshToken = (refreshToken: string) => {
    return UserModel.findOne({ refreshToken });
};

export const setProfilePicture = (id: string, profilePicture: string) => {
    return UserModel.findByIdAndUpdate(id, { profilePicture }, { new: true });
};

export const getAllUsers = (currentUserId: string) => {
    return UserModel.find({ _id: { $ne: currentUserId } }).sort('userName');
};

export const updateUsersGroupList = (userIds: string[], groupId: string) => {
    return UserModel.updateMany({ _id: { $in: userIds } }, { $addToSet: { groups: groupId } }, { multi: true });
};