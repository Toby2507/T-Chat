import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import { index } from "@typegoose/typegoose/lib";
import { Severity } from "@typegoose/typegoose/lib/internal/constants";
import { modelOptions } from "@typegoose/typegoose/lib/modelOptions";
import { DocumentType } from "@typegoose/typegoose/lib/types";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import log from "../utils/logger";

export const privateFields = ["password", "__v", "verificationCode", "passwordResetCode", "verified"]

@pre<User>("save", async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10)
    return;
})
@index({ email: 1 })
@modelOptions({
    schemaOptions: { timestamps: true },
    options: { allowMixed: Severity.ALLOW }
})
export class User {
    @prop({ lowercase: true, required: true, unique: true })
    email: string

    @prop({ required: true })
    firstName: string

    @prop({ required: true })
    lastName: string

    @prop({ required: true, unique: true })
    userName: string

    @prop({ required: true })
    password: string

    @prop({ default: () => nanoid() })
    verificationCode: string

    @prop({ default: false })
    verified: boolean

    @prop()
    passwordResetCode: string | null

    async validatePassword(this: DocumentType<User>, password: string) {
        try {
            return await bcrypt.compare(password, this.password)
        } catch (err) {
            log.error(err, 'Could not validate password')
            return false
        }
    }
}

const UserModel = getModelForClass(User);

export default UserModel