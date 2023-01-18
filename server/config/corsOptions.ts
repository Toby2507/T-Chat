import { CorsOptions } from "cors";

export const allowedOrigins = [
    "https://tobychat.netlify.app"
];

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(String(origin))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};