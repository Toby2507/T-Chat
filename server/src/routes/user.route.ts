import { Router } from "express";
import { forgotPasswordHandler, resetPasswordHandler, setProfilePictureHandler, verifyUserHandler } from "../controllers/user.controller";
import validateSchema from "../middlewares/validateSchema";
import { forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from "../schemas/user.schema";
import { parser } from "../utils/imageParser";

const router = Router();

router.get('/verify/:id/:verificationCode', validateSchema(verifyUserSchema), verifyUserHandler);
router.post('/forgotpassword', validateSchema(forgotPasswordSchema), forgotPasswordHandler);
router.post('/resetpassword/:id/:passwordResetCode', validateSchema(resetPasswordSchema), resetPasswordHandler);
router.post('/setprofilepicture', parser.single('image'), setProfilePictureHandler);

export default router;