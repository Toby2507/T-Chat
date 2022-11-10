import { Router } from "express";
import { loginUserHandler, logoutUserHandler, refreshAccessHandler } from "../controllers/auth.controller";
import validateSchema from "../middlewares/validateSchema";
import { loginUserSchema } from "../schemas/auth.schema";

const router = Router();

router.post('/login', validateSchema(loginUserSchema), loginUserHandler)
router.get('/refreshaccess', refreshAccessHandler)
router.get('/logout', logoutUserHandler)

export default router;