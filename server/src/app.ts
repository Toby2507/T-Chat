require('dotenv').config();
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import { corsOptions } from "../config/corsOptions";
import { corsCredentials } from "./middlewares/corsCredentials";
import deserializeUser from "./middlewares/deserializeUser";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import messageRoutes from "./routes/message.route";
import connectDB from "./utils/connectDB";
import log from "./utils/logger";

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

mongoose.connection.once('open', () => {
    log.info('Server Connected to DB');
    app.listen(port, () => log.info(`Server Listening on Port ${port}...`));
});