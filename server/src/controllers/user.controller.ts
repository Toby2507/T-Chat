import { Request, Response } from "express";
import { omit } from "lodash";
import { nanoid } from "nanoid";
import { privateFields } from "../models/user.model";
import { forgotPasswordInput, resetPasswordInput, verifyUserInput } from "../schemas/user.schema";
import { findUserByEmail, findUserById, setProfilePicture } from "../services/user.service";
import sendEmail from "../utils/mailer";

export const verifyUserHandler = async (req: Request<verifyUserInput>, res: Response) => {
    const { id, verificationCode } = req.params;
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: 'Could not verify user' });
    if (user.verified) return res.sendStatus(204);
    if (user.verificationCode === verificationCode) {
        user.verified = true;
        await user.save();
        return res.sendStatus(204);
    }
    return res.status(400).json({ message: 'Could not verify user' });
};

export const forgotPasswordHandler = async (req: Request<{}, {}, forgotPasswordInput>, res: Response) => {
    const { email } = req.body;
    const message = "If a user with that email exists, we've sent you an email with a link to reset your password.";
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message });
    if (!user.verified) return res.status(400).json({ message: 'Please verify your email' });
    const passwordResetCode = nanoid();
    user.passwordResetCode = passwordResetCode;
    await user.save();
    await sendEmail({
        to: user.email,
        from: "test@example.com",
        subject: "Reset your password",
        text: `Password reset code: ${passwordResetCode}, ID: ${user._id}`,
    });
    return res.status(200).json({ message });
};

export const resetPasswordHandler = async (req: Request<resetPasswordInput["params"], {}, resetPasswordInput["body"]>, res: Response) => {
    const { body: { password }, params: { id, passwordResetCode } } = req;
    const user = await findUserById(id);
    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) return res.status(400).json({ message: "Could not reset user password" });
    user.passwordResetCode = null;
    user.password = password;
    await user.save();
    return res.sendStatus(200);
};

export const setProfilePictureHandler = async (req: Request, res: Response) => {
    const { _id } = res.locals.user;
    const profilePicture = req.file?.path;
    if (!profilePicture) return res.status(400).json({ message: 'Could not set profile picture' });
    const user = await setProfilePicture(_id, profilePicture);
    if (!user) return res.status(400).json({ message: 'Could not set profile picture' });
    return res.status(200).json({ user: omit(user.toJSON(), privateFields) });
};