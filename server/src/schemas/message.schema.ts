import { array, object, string, TypeOf } from "zod";

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

export const readUserMessagesSchema = object({
  body: object({
    messages: array(string(), { required_error: "Message Ids are required" }),
    to: string({ required_error: "Please specify a To value" })
  })
});

export type addMessageInput = TypeOf<typeof addMessageSchema>["body"];
export type getMessagesInput = TypeOf<typeof getMessagesSchema>["params"];
export type readUserMessagesInput = TypeOf<typeof readUserMessagesSchema>["body"];