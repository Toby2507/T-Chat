import { Router } from "express";
import { createUserHandler, currentUserHandler, forgotPasswordHandler, resetPasswordHandler, verifyUserHandler } from "../controllers/user.controller";
import requireUser from "../middlewares/requireUser";
import validateSchema from "../middlewares/validateSchema";
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from "../schemas/user.schema";

const router = Router();

router.post('/signup', validateSchema(createUserSchema), createUserHandler)
router.get('/verify/:id/:verificationCode', validateSchema(verifyUserSchema), verifyUserHandler)
router.post('/forgotpassword', validateSchema(forgotPasswordSchema), forgotPasswordHandler)
router.post('/resetpassword/:id/:passwordResetCode', validateSchema(resetPasswordSchema), resetPasswordHandler)
router.get('/currentuser', requireUser, currentUserHandler)

export default router