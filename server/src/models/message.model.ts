import { getModelForClass, modelOptions, prop, Ref, Severity } from "@typegoose/typegoose";
import { User } from "./user.model";

@modelOptions({
  schemaOptions: { timestamps: true },
  options: { allowMixed: Severity.ALLOW }
})
export class Message {
  @prop({ ref: () => "User", required: true })
  sender: Ref<User>;

  @prop({ required: true })
  message: string;

  @prop({ required: true })
  users: string[];
}

const MessageModel = getModelForClass(Message);
export default MessageModel;