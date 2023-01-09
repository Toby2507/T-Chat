import { Router } from "express";
import { createGroupChatHandler, getGroupChatHandler } from "../controllers/groupChat.controller";
import requireUser from "../middlewares/requireUser";
import validateSchema from "../middlewares/validateSchema";
import { createGroupChatSchema } from "../schemas/groupChat.schemas";

const router = Router();

router.use(requireUser);
router.get('/getgroupchats', getGroupChatHandler);
router.post('/create', validateSchema(createGroupChatSchema), createGroupChatHandler);

export default router;