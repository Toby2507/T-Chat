require('dotenv').config();
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import { Server, Socket } from "socket.io";
import { allowedOrigins, corsOptions } from "../config/corsOptions";
import { corsCredentials } from "./middlewares/corsCredentials";
import deserializeUser from "./middlewares/deserializeUser";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import userRoutes from "./routes/user.route";
import connectDB from "./utils/connectDB";
import log from "./utils/logger";

interface newMessage {
    id: string;
    fromSelf: boolean;
    message: string;
    date: string;
    time: string;
    to?: string;
}
interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    receive_msg: (data: newMessage) => void;
}
interface ClientToServerEvents {
    add_user: (userId: string) => void;
    send_msg: (data: newMessage) => void;
}
interface InterServerEvents {
    ping: () => void;
}
interface SocketData {
    name: string,
    age: number;
}
declare global {
    var onlineUsers: Map<string, string>;
    var chatSocket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
}


const port = process.env.PORT;

const app = express();
connectDB();

// Middlewares
app.use(helmet());
app.use(corsCredentials);
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(cookieParser());
app.use(deserializeUser);

// Router
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/message', messageRoutes);

app.use(errorHandlerMiddleware);

global.onlineUsers = new Map<string, string>();
mongoose.connection.once('open', () => {
    log.info('Server Connected to DB');
    const server = app.listen(port, () => log.info(`Server Listening on Port ${port}...`));
    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true
        }
    });
    io.on('connection', socket => {
        log.info("New client connected");
        global.chatSocket = socket;
        socket.on('add_user', async userId => {
            onlineUsers.set(userId, socket.id);
            log.info('User added');
        });
        socket.on('send_msg', async data => {
            log.info('message recieved');
            const sendUserSocket = onlineUsers.get(data.to as string);
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit('receive_msg', data);
                log.info('message sent');
            }
        });
        socket.on('disconnect', () => {
            onlineUsers.forEach((value, key) => {
                if (value === socket.id) {
                    onlineUsers.delete(key);
                }
            });
        });
    });
});