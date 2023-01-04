import { Router } from "express";
import { addMessageHandler, getMessagesHandler, readUserMessagesHandler } from "../controllers/message.controller";
import requireUser from "../middlewares/requireUser";
import validateSchema from "../middlewares/validateSchema";
import { addMessageSchema, getMessagesSchema, readUserMessagesSchema } from "../schemas/message.schema";

const router = Router();

router.use(requireUser);
router.post('/addmsg', validateSchema(addMessageSchema), addMessageHandler);
router.get('/getmsg/:to', validateSchema(getMessagesSchema), getMessagesHandler);
router.patch('/readmsgs', validateSchema(readUserMessagesSchema), readUserMessagesHandler);

export default router;