import { TypeOf, object, string } from "zod";

export const createGroupChatSchema = object({
  body: object({
    name: string({ required_error: "Group name is required" }),
    description: string().optional(),
    members: string({ required_error: "Members are required" }).array(),
  })
});

export type createGroupChatInput = TypeOf<typeof createGroupChatSchema>["body"];