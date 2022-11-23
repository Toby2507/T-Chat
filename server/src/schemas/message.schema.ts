import { object, string, TypeOf } from "zod";

export const addMessageSchema = object({
  body: object({
    message: string({ required_error: "Message is required" }),
    to: string({ required_error: "Please specify a To value" })
  })
});

export const getMessagesSchema = object({
  params: object({
    to: string()
  })
});

export type addMessageInput = TypeOf<typeof addMessageSchema>["body"];
export type getMessagesInput = TypeOf<typeof getMessagesSchema>["params"];