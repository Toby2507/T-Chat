import { CorsOptions } from "cors"

export const allowedOrigins = [
    "http://localhost:3000"
]

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(String(origin)) || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}