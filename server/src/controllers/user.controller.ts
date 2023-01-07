import { Request, Response } from "express";
import { omit } from "lodash";
import { nanoid } from "nanoid";
import { privateFields } from "../models/user.model";
import { forgotPasswordInput, resendPasswordResetEmailInput, resetPasswordInput, verifyUserInput } from "../schemas/user.schema";
import { findUserByEmail, findUserById, getAllUsers, setProfilePicture } from "../services/user.service";
import sendEmail from "../utils/mailer";

export const getAllUsersHandler = async (req: Request, res: Response) => {
    const { _id } = res.locals.user;
    const users = await getAllUsers(_id);
    const sanitizedUsers = users.map(user => omit(user.toJSON(), [...privateFields, "archivedChats", "mutedUsers"]));
    return res.status(200).json(sanitizedUsers);
};

export const verifyUserHandler = async (req: Request<verifyUserInput>, res: Response) => {
    const { verificationCode } = req.params;
    const { _id } = res.locals.user;
    const user = await findUserById(_id);
    if (!user) return res.status(404).json({ message: 'Could not verify user' });
    if (user.verified) return res.sendStatus(204);
    if (user.verificationCode === +verificationCode) {
        user.verified = true;
        await user.save();
        return res.status(200).json({ user: omit(user.toJSON(), privateFields) });
    }
    return res.status(400).json({ message: 'Could not verify user' });
};

export const resendVerifyUserEmailHandler = async (req: Request, res: Response) => {
    const { _id } = res.locals.user;
    const user = await findUserById(_id);
    if (!user) return res.sendStatus(404);
    await sendEmail({
        to: user.email,
        template: "verifyUser",
        locals: { name: user.userName, verifyCode: user.verificationCode }
    });
    return res.sendStatus(204);
};

export const forgotPasswordHandler = async (req: Request<{}, {}, forgotPasswordInput>, res: Response) => {
    const { email } = req.body;
    const message = "If a user with that email exists, we've sent you an email with a link to reset your password.";
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message });
    const passwordResetCode = nanoid();
    user.passwordResetCode = passwordResetCode;
    await user.save();
    const resetUrl = `${req.get('origin')}/reset/${user._id}/${user.passwordResetCode}`;
    await sendEmail({
        to: user.email,
        template: "forgotPassword",
        locals: { name: user.userName, resetUrl }
    });
    return res.status(200).json({ message });
};

export const resendPasswordResetEmailHandler = async (req: Request<{}, {}, resendPasswordResetEmailInput>, res: Response) => {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.sendStatus(404);
    const resetUrl = `${req.get('origin')}/reset/${user._id}/${user.passwordResetCode}`;
    await sendEmail({
        to: user.email,
        template: "forgotPassword",
        locals: { name: user.userName, resetUrl }
    });
    return res.sendStatus(204);
};

export const resetPasswordHandler = async (req: Request<resetPasswordInput["params"], {}, resetPasswordInput["body"]>, res: Response) => {
    const { body: { password }, params: { id, passwordResetCode } } = req;
    const user = await findUserById(id);
    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) return res.status(400).json({ message: "Could not reset user password" });
    if (!user.verified) user.verified = true;
    user.passwordResetCode = null;
    user.password = password;
    await user.save();
    return res.sendStatus(204);
};

export const setProfilePictureHandler = async (req: Request, res: Response) => {
    const { _id } = res.locals.user;
    const profilePicture = req.file?.path;
    if (!profilePicture) return res.status(400).json({ message: 'Could not set profile picture' });
    const user = await setProfilePicture(_id, profilePicture);
    if (!user) return res.status(400).json({ message: 'Could not set profile picture' });
    return res.status(200).json({ user: omit(user.toJSON(), privateFields) });
};