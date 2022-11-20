import { Router } from "express";
import { forgotPasswordHandler, getAllUsersHandler, resendPasswordResetEmailHandler, resendVerifyUserEmailHandler, resetPasswordHandler, setProfilePictureHandler, verifyUserHandler } from "../controllers/user.controller";
import requireUser from "../middlewares/requireUser";
import validateSchema from "../middlewares/validateSchema";
import { forgotPasswordSchema, resendPasswordResetEmailSchema, resetPasswordSchema, verifyUserSchema } from "../schemas/user.schema";
import { parser } from "../utils/imageParser";

const router = Router();

router.post('/forgotpassword', validateSchema(forgotPasswordSchema), forgotPasswordHandler);
router.post('/resetpassword/:id/:passwordResetCode', validateSchema(resetPasswordSchema), resetPasswordHandler);
router.post('/resendforgotpasswordemail', validateSchema(resendPasswordResetEmailSchema), resendPasswordResetEmailHandler);
router.use(requireUser);
router.get('/verify/:verificationCode', validateSchema(verifyUserSchema), verifyUserHandler);
router.get('/resendverifyemail', resendVerifyUserEmailHandler);
router.post('/setprofilepicture', parser.single('image'), setProfilePictureHandler);
router.get('/getallusers', getAllUsersHandler);

export default router;