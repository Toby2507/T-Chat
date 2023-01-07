import { Router } from "express";
import requireUser from "../middlewares/requireUser";
import validateSchema from "../middlewares/validateSchema";
import { createGroupChatSchema } from "../schemas/groupChat.schemas";
import { createGroupChatHandler } from "../controllers/groupChat.controller";

const router = Router();

router.use(requireUser);
router.post('/create', validateSchema(createGroupChatSchema), createGroupChatHandler);

export default router;