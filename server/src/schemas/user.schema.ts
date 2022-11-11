import { object, string, TypeOf } from "zod";

export const verifyUserSchema = object({
    params: object({
        id: string(),
        verificationCode: string()
    })
});

export const forgotPasswordSchema = object({
    body: object({
        email: string({ required_error: "Email is required" }).email("Not a valid email")
    })
});

export const resetPasswordSchema = object({
    body: object({
        password: string({ required_error: "Password is required" }).min(8, "Password requires atleast 8 chars")
    }),
    params: object({
        id: string(),
        passwordResetCode: string()
    })
});

export type verifyUserInput = TypeOf<typeof verifyUserSchema>["params"];
export type forgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];
export type resetPasswordInput = TypeOf<typeof resetPasswordSchema>;