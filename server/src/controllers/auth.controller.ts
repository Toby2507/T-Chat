import { Request, Response } from "express";
import { omit } from "lodash";
import { privateFields } from "../models/user.model";
import { createUserInput, loginUserInput } from "../schemas/auth.schema";
import { findSessionById, signAccessToken, signRefreshToken } from "../services/auth.service";
import { createUser, findUserById, findUserByUsername } from "../services/user.service";
import { verifyJWT } from "../utils/jwt";
import sendEmail from "../utils/mailer";

export const createUserHandler = async (req: Request<{}, {}, createUserInput>, res: Response) => {
    const body = req.body;
    try {
        const user = await createUser(body);
        await sendEmail({
            from: "test@example.com",
            to: user.email,
            subject: "Please verify your email",
            text: `Verification code: ${user.verificationCode}, ID: ${user._id}`,
        });
        const accessToken = signAccessToken(user);
        const refreshToken = await signRefreshToken(user._id);
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).json({ user: omit(user.toJSON(), privateFields), accessToken });
    } catch (err: any) {
        if (err.code === 11000) return res.status(409).json({ message: 'User already exists' });
    }
};

export const loginUserHandler = async (req: Request<{}, {}, loginUserInput>, res: Response) => {
    const { userName, password } = req.body;
    const message = "Invalid username or password";
    const user = await findUserByUsername(userName);
    if (!user) return res.status(401).json({ message });
    const isUser = await user.validatePassword(password);
    if (!isUser) return res.status(401).json({ message });
    const accessToken = signAccessToken(user);
    const refreshToken = await signRefreshToken(user._id);
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ user: omit(user.toJSON(), privateFields), accessToken });
};

export const refreshAccessHandler = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(403);
    const refreshToken = cookies.jwt;
    const decoded = verifyJWT<{ sessionId: string; }>(refreshToken, "refreshTokenPublicKey");
    if (!decoded) return res.sendStatus(403);
    const session = await findSessionById(decoded.sessionId);
    if (!session || !session.valid) return res.sendStatus(403);
    const user = await findUserById(String(session.user));
    if (!user) return res.sendStatus(403);
    const accessToken = signAccessToken(user);
    res.json({ accessToken });
};

export const logoutUserHandler = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    const decoded = verifyJWT<{ sessionId: string; }>(refreshToken, "refreshTokenPublicKey");
    if (!decoded) return res.sendStatus(204);
    const session = await findSessionById(decoded.sessionId);
    if (session?.valid) {
        session.valid = false;
        await session.save();
    }
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    return res.sendStatus(204);
};