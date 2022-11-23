import { Router } from "express";
import { addMessageHandler, getMessagesHandler } from "../controllers/message.controller";
import requireUser from "../middlewares/requireUser";
import validateSchema from "../middlewares/validateSchema";
import { addMessageSchema, getMessagesSchema } from "../schemas/message.schema";

const router = Router();

router.use(requireUser);
router.post('/addmsg', validateSchema(addMessageSchema), addMessageHandler);
router.get('/getmsg/:to', validateSchema(getMessagesSchema), getMessagesHandler);

export default router;